# Prestop showroom demo

A standalone touchscreen demonstration of the driver check-in experience. Passport scanning uses the local Thales USB service; RFID, barcode and document screens use sample data. No Base44 account, server or login is needed.

## Hosted showroom demo

Open [the Netlify demo](https://fabulous-gaufre-1a3d46.netlify.app). Use this address as the Internet address in your SiteKiosk Online browser project. The kiosk needs internet to load this hosted version.

## Start

On Windows, double-click **START-DEMO.cmd** to build and open the demo. Keep its window open during the presentation. The first run installs dependencies and needs internet. Later runs work offline.


Install Node.js 22.12 or newer, then open a terminal in this folder:

    npm install
    npm run dev

Open the address printed in the terminal. Press F11 in the browser for a fullscreen showroom presentation.

## Build and run the finished demo

    npm run build
    npm run preview -- --host 0.0.0.0

Keep the terminal running. Open the printed address on the kiosk. Serve the build through a web server; do not double-click index.html.

The welcome image and looping video are bundled in public/media and work without internet once dependencies are installed. Browser speech uses voices installed on the showroom computer; install the desired language voices before presenting offline. Microphone access is optional, and visitors can simulate detection or continue directly.

## Presenting

Start check-in, choose a visit reason, and select any of the four identification methods. For a passport, start the local scanner service and press Scan passport; other methods use their demo scan buttons. Continue to the delivery details, optionally scan a document, then try audio assistance and finish. Completion returns to the welcome screen after 15 seconds. Inactive sessions reset after 90 seconds plus a 15-second warning. The welcome screen stays on display without an inactivity popup.

Switch between English, Dutch, German and French using the language selector. Tap the logo five times within 2.5 seconds to open diagnostics. Passport diagnostics use the local scanner; other device tests still use simulated data.

## Verification

    npm run build
    npm run lint
    npm run typecheck

Before an event, check the display size, volume, installed speech voices and video playback on the actual kiosk. No check-ins or identity documents are stored; refresh clears session state.

## USB passport scanner integration

Passport Scan now uses the localhost C# scanner service and fills scanned driver details into the kiosk flow. Production builds show Scan passport and never use fictional scanner responses. Other hardware services and delivery matching remain demo data.

Each kiosk needs its compatible x86 Thales SDK/drivers installed and the local service running. Restore your licensed MMMReaderDotNet50.dll and matching System.Drawing.Common.dll (5.0.0.1) to scanner-service/PrestopThalesScanner/sdk before building. These private DLLs and the vendor archives are intentionally excluded from GitHub. From scanner-service run .\Build-Deployment.ps1 and copy the entire generated deployment/win-x86 folder to the kiosk PC. See scanner-service/DEPLOYMENT.md and scanner-service/SITEKIOSK-STARTUP.md for startup, CORS and hardware tests. Paths mentioning webapp/prestop-standalone in those notes refer to this repository's root website directory.

For frontend development without hardware, create .env.local containing VITE_SCANNER_SIMULATED=true. This opt-in is effective only in Vite development mode. Disable it for hardware testing. The default scanner address is http://127.0.0.1:5081 on the PC displaying the website.

Run the API client checks with node --test scanner-service/Tests/passportClient.test.mjs. Actual SiteKiosk startup, local-network browser permissions and passport reads still need physical testing. No passport data or scan images are stored or logged.
