// PassportReaderService
// Currently returns simulated passport/ID data.
// Replace `scanPassport` with the real passport reader SDK integration later.

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const PassportReaderService = {
  isSimulated: true,

  async scanPassport() {
    // Simulate the read time of a real document reader.
    await delay(1200);
    return {
      name: "John Smith",
      nationality: "Netherlands",
      documentType: "Passport",
      documentNumber: "N12345678",
      dateOfBirth: "14-05-1985",
    };
  },
};

export default PassportReaderService;