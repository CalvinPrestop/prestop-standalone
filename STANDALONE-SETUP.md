# Prestop Driver Flow — standalone React demo

This version removes Base44 SDK, Vite plugin and hosted authentication. It retains the kiosk screens and existing demo hardware services.

In VS Code terminal, in this folder:

```sh
npm install
npm run dev
```

Use the URL shown by Vite (typically http://localhost:5173).

NOTE: Welcome screen background image/video still use Base44-hosted URLs. Replace them with local assets before offline deployment.
NOTE: Hardware service files are still demonstration/simulation implementations; do not treat them as real reader integrations.
NOTE: No authentication is provided. Do not expose technician screens or this app publicly without access controls.
