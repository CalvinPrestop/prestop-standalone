// RFIDReaderService
// Currently returns simulated RFID card data.
// Replace `readRFID` with the real USB/serial/HID RFID reader implementation later.

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const RFIDReaderService = {
  isSimulated: true,

  async readRFID() {
    await delay(1000);
    return {
      cardId: "RFID-458291",
      driver: "John Smith",
      company: "Demo Transport B.V.",
    };
  },
};

export default RFIDReaderService;