// BarcodeScannerService
// Currently returns a simulated scanned barcode value.
// Replace `readBarcode` with the real USB barcode scanner (HID/serial) implementation later.

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const BarcodeScannerService = {
  isSimulated: true,

  async readBarcode() {
    await delay(1000);
    return {
      deliveryReference: "DEL-2026-00152",
      order: "PO-58421",
      company: "Demo Transport B.V.",
      destination: "Warehouse A",
    };
  },
};

export default BarcodeScannerService;