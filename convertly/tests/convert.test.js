const { test } = require('node:test');
const assert = require('node:assert/strict');
const { convert } = require('../src/convert');

test('converts USD to EUR', () => {
  assert.equal(convert(100, 'USD', 'EUR'), 91);
});

test('converts EUR back to USD', () => {
  assert.equal(convert(91, 'EUR', 'USD'), 100);
});

test('is case-insensitive on currency codes', () => {
  assert.equal(convert(100, 'usd', 'eur'), 91);
});

test('throws on unsupported currency', () => {
  assert.throws(() => convert(10, 'USD', 'XYZ'));
});
