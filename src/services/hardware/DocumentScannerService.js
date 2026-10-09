// DocumentScannerService
// Currently returns simulated scanned delivery document data.
// Replace `scanDocument` with the real document scanner SDK/API later.

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const DocumentScannerService = {
  isSimulated: true,

  async scanDocument() {
    await delay(1500);
    return {
      deliveryReference: "DEL-2026-00152",
      orderNumber: "PO-58421",
      transportCompany: "Demo Transport B.V.",
      destination: "Warehouse A",
    };
  },
};

export default DocumentScannerService;