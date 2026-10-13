using System.Reflection.PortableExecutable;
using System.Reflection.Metadata;
var a = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<".PadRight(44, '<');
var b = "L898902C36UTO7408122F1204159ZE184226B<<<<<10";
void Assert(bool value, string test) { if (!value) throw new Exception(test); Console.WriteLine("PASS " + test); }
var result = MrzParser.Parse(a, b, null, null);
Assert(result.Success && result.FirstName == "ANNA MARIA" && result.LastName == "ERIKSSON" && result.DocumentNumber == "L898902C3", "fictional TD3 parsed");
Assert(result.CheckDigitsValid == true && result.DateOfBirth!.Contains("century unverified"), "checks and date ambiguity");
Assert(!MrzParser.Parse(a, "X" + b[1..], null, null).Success, "document check rejects corrupt scan");
Assert(!MrzParser.Parse(a, b[..43] + "1", null, null).Success, "composite check rejects corrupt scan");
Assert(!MrzParser.Parse(a, b[..42] + "0" + b[43..], null, null).Success, "optional-data check rejects corrupt scan");
Assert(MrzParser.Parse(new string('<',30), new string('<',30), new string('<',30), null).Code == "unsupported_document", "TD1 preparation");
Assert(MrzParser.Parse(new string('<',36), new string('<',36), null, null).Code == "unsupported_document", "TD2 preparation");
Assert(!MrzParser.Parse(null, null, null, null).Success, "missing MRZ rejects");
Assert(!MrzParser.Parse(a, b, "unexpected", null).Success, "unexpected third line rejects");
using var stream = File.OpenRead(Path.Combine(AppContext.BaseDirectory, "../../../../PrestopThalesScanner/sdk/MMMReaderDotNet50.dll"));
using var pe = new PEReader(stream);
Console.WriteLine($"SDK PE machine: {pe.PEHeaders.CoffHeader.Machine}; CLR flags: {pe.PEHeaders.CorHeader!.Flags}");
Assert(pe.PEHeaders.CoffHeader.Machine == Machine.I386 && pe.PEHeaders.CorHeader.Flags.HasFlag(CorFlags.Requires32Bit), "SDK requires x86");
var metadata = pe.GetMetadataReader();
foreach (var h in metadata.TypeDefinitions) {
 var type = metadata.GetTypeDefinition(h);
 if (metadata.GetString(type.Name) != "Reader") continue;
 foreach (var m in type.GetMethods()) { var method = metadata.GetMethodDefinition(m); var name = metadata.GetString(method.Name); if (new[]{"Initialise","WaitForDocumentOnWindow","ReadDocument","GetData","Shutdown","EnableLogging"}.Contains(name)) Console.WriteLine("SDK method confirmed: " + name); }
}

foreach (var h in metadata.AssemblyReferences) {
 var reference = metadata.GetAssemblyReference(h);
 Console.WriteLine("SDK assembly dependency: " + metadata.GetString(reference.Name) + " " + reference.Version);
}
using var archive = System.IO.Compression.ZipFile.OpenRead(Path.GetFullPath("../thales-reference/Bin.zip"));
foreach (var name in new[]{"MMMReaderHighLevelAPI.dll","MMMReaderLowLevelAPI.dll","ErrorHandlerDll.dll","DeviceDll.dll","SettingsDll.dll"}) {
 using var input = archive.GetEntry("Bin/" + name)!.Open(); using var memory = new MemoryStream(); input.CopyTo(memory); memory.Position=0;
 using var native = new PEReader(memory);
 Assert(native.PEHeaders.CoffHeader.Machine == Machine.I386, "native x86 " + name);
}
using var drawingStream = File.OpenRead(Path.GetFullPath("PrestopThalesScanner/sdk/System.Drawing.Common.dll"));
using var drawingPe = new PEReader(drawingStream);
Assert(drawingPe.GetMetadataReader().GetAssemblyDefinition().Version == new Version(5,0,0,1), "supplied drawing dependency matches SDK");
