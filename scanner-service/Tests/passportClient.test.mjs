import test from 'node:test';
import assert from 'node:assert/strict';


const { createPassportClient } = await import(new URL('../../src/services/hardware/passportClient.js', import.meta.url));
test('initialization and scan call real endpoint; map scanned name', async () => {
  const calls = [];
  const client = createPassportClient({ fetchImpl: async (url, options) => {
    calls.push([url, options]);
    return { ok: true, json: async () => url.endsWith('/initialize') ? {success:true} :
      {success:true, checkDigitsValid:true, firstName:'ANNA MARIA', lastName:'ERIKSSON', documentNumber:'L898902C3'} };
  }});
  await client.initialize();
  assert.equal((await client.scanPassport()).name, 'ANNA MARIA ERIKSSON');
  assert.equal(calls[0][0], 'http://127.0.0.1:5081/api/scanner/initialize');
  assert.equal(calls[1][0], 'http://127.0.0.1:5081/api/scanner/scan');
  assert.equal(calls[1][1].method, 'POST');
  assert.equal(calls[1][1].cache, 'no-store');
});
for (const status of [408,409,422,503]) test('API failure '+status+' never succeeds', async () => {
  const client = createPassportClient({fetchImpl:async()=>({ok:false,json:async()=>({success:false,error:'Safe scanner error'})})});
  await assert.rejects(client.scanPassport(), /Safe scanner error/);
});
test('network failure gives usable message',async()=>{
 const client=createPassportClient({fetchImpl:async()=>{throw new TypeError('network')}});
 await assert.rejects(client.scanPassport(), /Cannot reach the local scanner service/);
});
test('invalid scan cannot populate driver',async()=>{
 const client=createPassportClient({fetchImpl:async()=>({ok:true,json:async()=>({success:true,checkDigitsValid:false})})});
 await assert.rejects(client.scanPassport(), /could not be validated/);
});
test('caller cancellation is passed to fetch',async()=>{
 const controller=new AbortController(); controller.abort();
 const client=createPassportClient({fetchImpl:async(_url,options)=>{assert.equal(options.signal.aborted,true); throw new DOMException('Aborted','AbortError')}});
 await assert.rejects(client.scanPassport(controller.signal), /Scan cancelled/);
});
