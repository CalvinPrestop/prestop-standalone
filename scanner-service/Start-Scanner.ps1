param([Parameter(Mandatory=$true)][string]$SdkBin, [string]$AllowedOrigins='http://localhost:5173,http://127.0.0.1:5173')
$ErrorActionPreference='Stop'
if (!(Test-Path -LiteralPath (Join-Path $SdkBin 'MMMReader.ini'))) { throw 'Choose the installed Thales SDK Bin directory.' }
$env:PRESTOP_THALES_SDK_BIN=(Resolve-Path -LiteralPath $SdkBin).Path
$env:PRESTOP_ALLOWED_ORIGINS=$AllowedOrigins
& (Join-Path $PSScriptRoot 'PrestopThalesScanner.exe')
