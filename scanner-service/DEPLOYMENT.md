# Prestop scanner integration and test-PC deployment

## Build and run

On the development PC, from scanner-service:

```powershell
.\Build-Deployment.ps1
```

Copy the complete `deployment\win-x86` folder to the separate Windows 11 test PC. This is self-contained: Visual Studio and .NET SDK are not required there. It uses that PC's existing x86 Thales SDK installation, drivers, configuration, plugins, data and licensing. Do not mix SDK versions or copy only the DLLs from Bin.zip. The supplied archive's MMMReader.ini names version 3.9.2.42 and resolves Config/Plugins/Data/Layout relative to the SDK root.

1. Close ReaderExpo and the Thales example so only this service owns the scanner.
2. Open PowerShell in the copied folder and run (adjust the SDK directory and browser origin to the actual installed values):

```powershell
.\Start-Scanner.ps1 -SdkBin 'C:\Program Files (x86)\Thales\Thales Document Reader SDK\3.9.2.42\Bin' -AllowedOrigins 'http://localhost:5173,http://127.0.0.1:5173'
```

3. Check status and initialize:

```powershell
Invoke-RestMethod http://127.0.0.1:5081/api/scanner/status
Invoke-RestMethod http://127.0.0.1:5081/api/scanner/initialize -Method Post -ContentType application/json -Body '{}'
```

Status must show `architecture: X86`, `mode: hardware`; successful initialization sets `initialized: true`. The EXE cannot bind to LAN even if ASPNETCORE_URLS is changed. The frontend and service must run on the same test PC because 127.0.0.1 always means the browser's own PC.

4. Serve the React app locally on that PC, open Passport Scan, place a passport on the scanner and press Scan passport. Confirm the displayed name, number, nationality and DOB before continuing. Try no document (10-second timeout), bad placement, invalid MRZ, repeat scans, disconnect/reconnect, ReaderExpo contention and restart. Confirm the driver's scanned name remains visible on the next screen.
5. Exit the scanner with Ctrl+C. SDK shutdown is serialized after outstanding work. If a native call exceeds 45 seconds, the API responds with `restart_required`; no further calls are allowed. Restart the service. A browser abort cannot forcibly cancel a blocking native call; the operation retains exclusive access until it returns.

Allow only the actual kiosk origin using PRESTOP_ALLOWED_ORIGINS (comma separated, no wildcard, path, credentials or trailing slash). For a local production preview use `http://127.0.0.1:4173` and set Vite preview to that host/port. Do not use file:// / null origins. An HTTPS-hosted kiosk accessing an HTTP loopback API may require browser local-network permission and SiteKiosk configuration. Verify this on the deployed SiteKiosk/browser; CORS alone does not resolve browser permission or mixed-content restrictions. No firewall opening is required.

## Development without hardware

In webapp/prestop-standalone create `.env.local`:

```text
VITE_SCANNER_SIMULATED=true
VITE_SCANNER_API_URL=http://127.0.0.1:5081
```

Run `npm install` then `npm run dev`. The Passport page labels the simulation and uses only the fictional ICAO Utopia specimen. Restart Vite after changing environment settings. Without explicit opt-in it calls the real API. Production builds always remove the simulated branch through `import.meta.env.DEV`, even if VITE_SCANNER_SIMULATED is true. The C# service has no simulation mode.

The existing delivery flow is still demo data: a passport does not establish a delivery reference. This patch preserves the existing demo delivery/navigation and replaces its displayed driver name with the scanned driver. A real Peripass delivery lookup remains a separate integration; do not treat the demo delivery as a scanner-verified booking. Other hardware screens remain demo services. This integration does not upload scans anywhere.

## Privacy and MRZ behavior

No scan files, document images, raw MRZ response, passport payload logs, browser storage or telemetry were added. The service disables SDK logging, logs only fixed failure codes / exception type / HRESULT, and returns Cache-Control: no-store. Passport details live only in the API response and React flow memory, which existing cancel/idle/reset clears. The SDK may retain its own in-process capture buffers until another read or shutdown; no unverified clearing method was invented. Check the installed SDK configuration for any independent image/output plugin persistence and disable it before using personal documents.

TD3 passports require exact line lengths and document, DOB, expiry, optional data and composite checks. DOB/expiry retain YY-MM-DD with an explicit century warning. Passing MRZ checks is not identity authentication or an expiration check. TD1/TD2 ID-card shapes return HTTP 422 `unsupported_document`; the SDK extraction already reads Line3 in preparation for future ID-card parsing.

## Previous HTTP 500 investigation

The exact original cause cannot be confirmed without the failing PC's safe diagnostics. Supplied task notes report a prior win-x64 publish with CS8012; the actual wrapper has PE I386 and CLR Requires32Bit, so x64 execution is incompatible. Five native dependencies listed in DependentDLLs.txt are also I386. The old publish included the wrapper but not the installed native/runtime resource tree. Additionally, the wrapper references System.Drawing.Common 5.0.0.1; the matching DLL from Bin.zip is now copied alongside the EXE. Both incorrect architecture and missing managed/native dependencies can raise load/JIT exceptions before the old Scan catch executes. The new no-inline SDK boundary catches load exceptions and reports safe structured 503 responses. Initialization is now available explicitly instead of returning 404.

Responses: 200 success; 409 busy; 408 no document within ten seconds; 422 missing/invalid/unsupported MRZ; 503 runtime or SDK failure; 403 unapproved Origin. Never capture passport response bodies in diagnostic logs.

## Verification

Run from scanner-service:

```powershell
dotnet run --project Tests
node --test Tests/passportClient.test.mjs
.\Build-Deployment.ps1
.\Tests\ApiSmoke.ps1
```

ApiSmoke is a development-PC check expecting no installed Thales runtime; it briefly starts/stops only the new service and checks safe errors, CORS, no-store and loopback binding. Do not run it against an active kiosk service.

Run `npm run build`, `npm run lint`, and `npm run typecheck` in the React folder. The repository's lint/typecheck configuration has limited coverage, so the separate API-client tests supplement them.

Hardware still required: initialization against the installed SDK, actual USB capture, OCR quality, timeout behavior of native ReadDocument, device recovery, repeated scans, SDK output settings, and SiteKiosk/browser loopback policy. No software was installed or settings changed on the separate test PC.

## Results on the development PC (9 October 2026)

- Release Windows x86 self-contained publish succeeded without compiler warnings/errors.
- SDK metadata confirms Requires32Bit and the six used method names; the actual supplied C# example confirms the call signatures. All five listed native runtime libraries are I386. The supplied System.Drawing.Common assembly exactly matches the wrapper's 5.0.0.1 dependency.
- Parser/architecture/dependency checks passed; eight frontend API tests passed; seven API smoke checks passed.
- React production build, lint and typecheck passed after correcting existing optional-prop declarations, image component typings, unused imports and Vite environment types. No interface styling was changed by those corrections.
- Production build with VITE_SCANNER_SIMULATED=true was checked: fictional passport values are absent from the generated JavaScript.
- npm install reported 11 third-party dependency audit findings (2 low, 4 moderate, 5 high). Dependency upgrades were not applied as part of scanner integration; assess them before exposing the kiosk app beyond its intended local deployment.
- This PC has no installed Thales runtime at the default path. Both initialize and scan return structured HTTP 503 sdk_dependency_missing. This confirms safe failure handling, not successful USB scanning.

## Hidden USB launcher

Copy Start-Scanner-Hidden.vbs into the same directory as the scanner EXE on the kiosk PC. Stop the visible batch-launched service first. Close ReaderExpo and the SDK example, then double-click the VBS launcher. It sets the same Netlify origin and SDK location as the batch file and launches the EXE with no console window; it does not change Windows settings or install anything. Edit sdkBin inside the launcher if your installed SDK version differs.

Check http://127.0.0.1:5081/api/scanner/status on that PC to verify startup. To stop the hidden instance, use Task Manager and end PrestopThalesScanner.exe. Use the original visible batch file for troubleshooting. If Windows blocks VBScript, leave security settings enabled and use Task Scheduler under the kiosk user instead.

Hidden execution does not survive reboot or logoff, and does not prevent SiteKiosk from stopping applications. SiteKiosk automatic startup under its own Windows account must be configured and verified separately. No automatic-start task or device changes were made by creating this launcher.
