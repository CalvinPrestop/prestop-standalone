# Prestop Thales scanner service

Windows x86 ASP.NET Core USB service; build and deployment instructions are in ../DEPLOYMENT.md and ../../README.md.

The licensed MMMReaderDotNet50.dll and matching System.Drawing.Common.dll must be supplied locally under sdk/. They are intentionally not committed. Use ../Build-Deployment.ps1 to publish the self-contained win-x86 application. Do not build this wrapper as x64.

Automated parser/dependency/API checks passed on the development PC. Reader detection was reported successful in the vendor example on the showroom PC; end-to-end SiteKiosk scanning and automatic startup still require physical testing. No real scan response should be written to logs.
