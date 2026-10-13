Option Explicit
Dim shell, files, folder, executable, sdkBin, environment
Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")
folder = files.GetParentFolderName(WScript.ScriptFullName)
executable = files.BuildPath(folder, "PrestopThalesScanner.exe")

' Edit this path if the installed Thales SDK version differs.
sdkBin = "C:\Program Files (x86)\Thales\Thales Document Reader SDK\3.9.2.42\Bin"
Set environment = shell.Environment("PROCESS")
environment("PRESTOP_THALES_SDK_BIN") = sdkBin
environment("PRESTOP_ALLOWED_ORIGINS") = "https://fabulous-gaufre-1a3d46.netlify.app"

' Check syntax/configuration without launching anything.
If WScript.Arguments.Count > 0 Then
    If LCase(WScript.Arguments(0)) = "/check" Then
        WScript.Echo "Launcher configuration loaded; no process started."
        WScript.Quit 0
    End If
End If
If Not files.FileExists(executable) Then
    MsgBox "Copy this launcher beside PrestopThalesScanner.exe in C:\PrestopScanner\deployment\win-x86.", vbExclamation, "Prestop scanner"
    WScript.Quit 1
End If
If Not files.FileExists(files.BuildPath(sdkBin, "MMMReader.ini")) Then
    MsgBox "SDK folder not found. Edit sdkBin in this launcher to match the installed Thales Bin folder.", vbExclamation, "Prestop scanner"
    WScript.Quit 1
End If
shell.CurrentDirectory = folder
' Launch directly without a console window or hidden batch-file pause.
' Stop any existing service before launching. Stop via Task Manager afterwards.
' This does not install automatic startup or survive Windows logoff/reboot.
shell.Run Chr(34) & executable & Chr(34), 0, False
