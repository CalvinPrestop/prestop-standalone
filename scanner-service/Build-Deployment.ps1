param([string]$OutputDirectory = (Join-Path $PSScriptRoot 'deployment\win-x86'))
$ErrorActionPreference='Stop'
dotnet publish (Join-Path $PSScriptRoot 'PrestopThalesScanner\PrestopThalesScanner.csproj') -c Release -r win-x86 --self-contained true -o $OutputDirectory
if ($LASTEXITCODE -ne 0) { throw 'Publish failed' }
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Start-Scanner.ps1') -Destination $OutputDirectory
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Start-Scanner.bat') -Destination $OutputDirectory
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'Start-Scanner-Hidden.vbs') -Destination $OutputDirectory
Write-Host "Build ready: $OutputDirectory. Uses the test PC's installed Thales SDK; do not copy partial Bin.zip files."
