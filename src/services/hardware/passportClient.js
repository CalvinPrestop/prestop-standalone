
export function createPassportClient({ baseUrl = 'http://127.0.0.1:5081', fetchImpl = fetch } = {}) {
  async function request(path, method, signal) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) controller.abort();
    const timer = setTimeout(abort, 50000);
    try {
      const response = await fetchImpl(baseUrl + '/api/scanner/' + path, {
        method, signal: controller.signal, cache: 'no-store', credentials: 'omit',
        headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
        ...(method === 'POST' ? { body: '{}' } : {}),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.error || 'Scanner request failed. Please retry.');
      return data;
    } catch (error) {
      if (signal?.aborted) throw new Error('Scan cancelled.');
      if (error.name === 'AbortError') throw new Error('Scanner request timed out. Wait for the scanner to finish or restart the service.');
      if (error instanceof TypeError) throw new Error('Cannot reach the local scanner service. Check that it is running.');
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  }
  return {
    initialize: (signal) => request('initialize', 'POST', signal),
    status: (signal) => request('status', 'GET', signal),
    async scanPassport(signal) {
      const data = await request('scan', 'POST', signal);
      if (!data.success || !data.checkDigitsValid || !data.firstName || !data.lastName || !data.documentNumber)
        throw new Error('Passport details could not be validated. Please retry.');
      return { ...data, name: data.firstName + ' ' + data.lastName };
    },
  };
}
