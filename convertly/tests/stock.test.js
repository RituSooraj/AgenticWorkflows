const { test, mock, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { getGooglePriceUSD } = require('../src/stock');

afterEach(() => {
  mock.reset();
});

test('reads the GOOGL price from a successful response', async () => {
  mock.method(global, 'fetch', async () => ({
    ok: true,
    json: async () => ({ chart: { result: [{ meta: { regularMarketPrice: 175.23 } }] } }),
  }));

  const price = await getGooglePriceUSD();
  assert.equal(price, 175.23);
});

test('throws when the response is not ok', async () => {
  mock.method(global, 'fetch', async () => ({ ok: false, status: 500 }));

  await assert.rejects(() => getGooglePriceUSD(), /Yahoo Finance API error: 500/);
});

test('throws when the price is missing from the response', async () => {
  mock.method(global, 'fetch', async () => ({
    ok: true,
    json: async () => ({ chart: { result: [{ meta: {} }] } }),
  }));

  await assert.rejects(() => getGooglePriceUSD(), /Could not read GOOGL price/);
});
