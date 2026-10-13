
import { createPassportClient } from './passportClient';
const simulated = import.meta.env.DEV && import.meta.env.VITE_SCANNER_SIMULATED === 'true';
const real = createPassportClient({ baseUrl: import.meta.env.VITE_SCANNER_API_URL || 'http://127.0.0.1:5081' });
export const PassportReaderService = simulated ? {
  isSimulated: true,
  async initialize() { return { success: true }; },
  async scanPassport(signal) {
    await new Promise((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(new Error('Scan cancelled.')); };
      const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, 1200);
      signal?.addEventListener('abort', abort, { once: true });
      if (signal?.aborted) abort();
    });
    return {
      success: true, checkDigitsValid: true, name: 'ANNA MARIA ERIKSSON',
      firstName: 'ANNA MARIA', lastName: 'ERIKSSON', nationality: 'UTO',
      documentType: 'Passport', documentNumber: 'L898902C3',
      dateOfBirth: '74-08-12 (YY-MM-DD; century unverified)',
      expiryDate: '12-04-15 (YY-MM-DD; century unverified)',
    };
  },
} : { ...real, isSimulated: false };
export default PassportReaderService;
