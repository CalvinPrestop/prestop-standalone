$ErrorActionPreference='Stop'
$exe=Join-Path $PSScriptRoot '..\deployment\win-x86\PrestopThalesScanner.exe'
$process=Start-Process -FilePath $exe -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $PSScriptRoot 'api-stdout.log') -RedirectStandardError (Join-Path $PSScriptRoot 'api-stderr.log')
try {
  $ready=$false
  for($i=0;$i -lt 30;$i++) { try { $status=Invoke-RestMethod 'http://127.0.0.1:5081/api/scanner/status'; $ready=$true; break } catch { Start-Sleep -Milliseconds 200 } }
  if(!$ready) { throw 'Service did not start' }
  if($status.architecture -ne 'X86' -or $status.initialized) { throw 'Unexpected status' }
  Write-Host 'PASS x86 status available without hardware'
  foreach($endpoint in 'initialize','scan') {
    $r=Invoke-WebRequest "http://127.0.0.1:5081/api/scanner/$endpoint" -Method Post -ContentType 'application/json' -Body '{}' -SkipHttpErrorCheck
    $data=$r.Content | ConvertFrom-Json
    if($r.StatusCode -ne 503 -or $data.code -ne 'sdk_dependency_missing') { throw "Unexpected $endpoint result" }
    Write-Host "PASS $endpoint returns safe 503 sdk_dependency_missing instead of 500"
  }
  $r=Invoke-WebRequest 'http://127.0.0.1:5081/api/scanner/scan' -Method Post -Headers @{Origin='https://untrusted.example'} -SkipHttpErrorCheck
  if($r.StatusCode -ne 403) { throw 'Origin not rejected' }
  Write-Host 'PASS untrusted origin blocked'
  $r=Invoke-WebRequest 'http://127.0.0.1:5081/api/scanner/initialize' -Method Options -Headers @{Origin='http://localhost:5173';'Access-Control-Request-Method'='POST';'Access-Control-Request-Headers'='content-type'}
  if($r.Headers['Access-Control-Allow-Origin'] -ne 'http://localhost:5173') { throw 'CORS preflight failed' }
  Write-Host 'PASS explicit development CORS origin'
  $r=Invoke-WebRequest 'http://127.0.0.1:5081/api/scanner/status'
  if($r.Headers['Cache-Control'] -ne 'no-store') { throw 'Cache header missing' }
  Write-Host 'PASS no-store response'
  $listeners=Get-NetTCPConnection -LocalPort 5081 -State Listen | Where-Object OwningProcess -eq $process.Id
  if(!$listeners -or ($listeners | Where-Object LocalAddress -ne '127.0.0.1')) { throw 'Service not restricted to loopback' }
  Write-Host 'PASS listener bound only to 127.0.0.1'
} finally { if(!$process.HasExited) { Stop-Process -Id $process.Id } }
