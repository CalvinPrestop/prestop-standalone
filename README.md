# Prestop showroom demo

A standalone touchscreen demonstration of the driver check-in experience. All passport, RFID, barcode and document scans use sample data. No Base44 account, server or login is needed.

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

Start check-in, choose a visit reason, and select any of the four identification methods. Tap the simulate scan button, continue to the delivery details, optionally scan a document, then try audio assistance and finish. Completion returns to the welcome screen after 15 seconds. Inactive sessions reset after 90 seconds plus a 15-second warning. The welcome screen stays on display without an inactivity popup.

Switch between English, Dutch, German and French using the language selector. Tap the logo five times within 2.5 seconds to open diagnostics. These tests demonstrate devices using simulated data.

## Verification

    npm run build
    npm run lint
    npm run typecheck

Before an event, check the display size, volume, installed speech voices and video playback on the actual kiosk. No check-ins or identity documents are stored; refresh clears session state.
