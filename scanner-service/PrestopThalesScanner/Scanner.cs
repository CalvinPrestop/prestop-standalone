using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using MMM.Readers;
using MMM.Readers.FullPage;

// All SDK calls, including shutdown, run on one STA thread, as in the WinForms example.
sealed class Scanner : IDisposable
{
    readonly BlockingCollection<Action> queue = new();
    readonly Thread worker;
    readonly ILogger<Scanner> logger;
    int busy;
    volatile bool initialized;
    volatile bool stopping;
    volatile bool stalled;
    string? lastCode;
    public bool Initialized => initialized;
    public bool Busy => Volatile.Read(ref busy) != 0;
    public string? LastCode => lastCode;
    public Scanner(ILogger<Scanner> logger)
    {
        this.logger = logger;
        worker = new Thread(() => { foreach (var action in queue.GetConsumingEnumerable()) action(); }) { IsBackground = true, Name = "Thales scanner" };
        worker.SetApartmentState(ApartmentState.STA);
        worker.Start();
    }
    public async Task<ScanResult> Execute(bool scan)
    {
        if (stopping) return ScanResult.Fail("stopping", "Scanner service is stopping.");
        if (stalled) return ScanResult.Fail("restart_required", "Scanner call exceeded its time limit. Restart the scanner service.");
        if (Interlocked.CompareExchange(ref busy, 1, 0) != 0) return ScanResult.Fail("busy", "Scanner is busy. Wait before retrying.");
        var completion = new TaskCompletionSource<ScanResult>(TaskCreationOptions.RunContinuationsAsynchronously);
        queue.Add(() =>
        {
            ScanResult result;
            try { result = Run(scan); }
            catch (Exception ex)
            {
                // Never expose exception messages, SDK payloads or stack traces: they can contain PII.
                var cause = ex is TypeInitializationException && ex.InnerException != null ? ex.InnerException : ex;
                var code = cause is BadImageFormatException ? "architecture_mismatch" :
                    cause is DllNotFoundException or FileNotFoundException ? "sdk_dependency_missing" : "sdk_exception";
                result = ScanResult.Fail(code, "Scanner runtime could not be used. Check x86 SDK installation and restart the service.");
                logger.LogWarning("Scanner exception type {Type}, HRESULT {HResult}", cause.GetType().Name, cause.HResult);
                initialized = false;
            }
            lastCode = result.Code;
            if (!result.Success) logger.LogWarning("Scanner operation failed: {Code}", result.Code);
            Interlocked.Exchange(ref busy, 0);
            completion.TrySetResult(result);
        });
        try { return await completion.Task.WaitAsync(TimeSpan.FromSeconds(45)); }
        catch (TimeoutException)
        {
            stalled = true;
            lastCode = "restart_required";
            // Keep the operation occupied. Never call Shutdown concurrently with a hung native read.
            return ScanResult.Fail("restart_required", "Scanner call exceeded 45 seconds. Restart the service before retrying.");
        }
    }
    ScanResult Run(bool scan)
    {
        if (Environment.Is64BitProcess) return ScanResult.Fail("architecture_mismatch", "Run the Windows x86 build.");
        var bin = Environment.GetEnvironmentVariable("PRESTOP_THALES_SDK_BIN")
            ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Thales", "Thales Document Reader SDK", "3.9.2.42", "Bin");
        bin = Path.GetFullPath(bin);
        string[] required = ["MMMReader.ini", "MMMReaderHighLevelAPI.dll", "MMMReaderLowLevelAPI.dll", "ErrorHandlerDll.dll", "DeviceDll.dll", "SettingsDll.dll"];
        if (required.Any(name => !File.Exists(Path.Combine(bin, name))))
            return ScanResult.Fail("sdk_dependency_missing", "SDK runtime is incomplete. Set PRESTOP_THALES_SDK_BIN to the installed Thales Bin folder.");
        if (!initialized)
        {
            Directory.SetCurrentDirectory(bin);
            if (!SetDllDirectory(bin)) return ScanResult.Fail("sdk_path_error", "Cannot configure the SDK native library directory.");
        }
        return ReadSdk(scan);
    }
    // This boundary ensures managed/native load failures occur inside Execute's catch, not during its JIT compilation.
    [MethodImpl(MethodImplOptions.NoInlining)]
    ScanResult ReadSdk(bool scan)
    {
        if (!initialized)
        {
            // Signatures verified in Peripass/DotNET/HLBlockingExample.NET/MainForm.cs.
            Reader.EnableLogging(false, 0, -1, "");
            var code = Reader.Initialise(null, null, null, null, true, false);
            if (code != ErrorCode.NO_ERROR_OCCURRED) return Failure("initialize", code);
            initialized = true;
        }
        if (!scan) return new(true);
        var wait = Reader.WaitForDocumentOnWindow(10000);
        if (wait == ErrorCode.ERROR_TIMED_OUT) return ScanResult.Fail("document_timeout", "No document detected within 10 seconds. Place the document on the scanner and retry.");
        if (wait != ErrorCode.NO_ERROR_OCCURRED) return Failure("detect", wait);
        var read = Reader.ReadDocument();
        if (read != ErrorCode.NO_ERROR_OCCURRED) return Failure("read", read);
        object data = null!;
        var result = Reader.GetData(DataType.CD_CODELINE_DATA, ref data);
        if (result != ErrorCode.NO_ERROR_OCCURRED) return Failure("mrz", result);
        if (data is not CodelineData mrz) return ScanResult.Fail("no_mrz", "No MRZ returned. Reposition the document and retry.");
        return MrzParser.Parse(mrz.Line1, mrz.Line2, mrz.Line3, mrz.DocType);
    }
    ScanResult Failure(string phase, ErrorCode code)
    {
        if (initialized) ShutdownSdk();
        return ScanResult.Fail("sdk_" + phase + "_" + code, "Scanner " + phase + " failed (" + code + "). Close ReaderExpo, check the scanner connection, and retry.");
    }
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    static extern bool SetDllDirectory(string path);
    [MethodImpl(MethodImplOptions.NoInlining)]
    void ShutdownSdk() { if (initialized) Reader.Shutdown(); initialized = false; }
    public void Dispose()
    {
        if (stopping) return;
        stopping = true;
        queue.Add(() => { try { ShutdownSdk(); } catch { logger.LogWarning("SDK shutdown failed."); } });
        queue.CompleteAdding();
        worker.Join(TimeSpan.FromSeconds(2));
    }
}
