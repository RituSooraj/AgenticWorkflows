const fs = require('fs');
const path = require('path');

const RATES_PATH = path.join(__dirname, '..', 'data', 'rates.json');

function loadRates() {
  const raw = fs.readFileSync(RATES_PATH, 'utf-8');
  return JSON.parse(raw);
}

module.exports = { loadRates, RATES_PATH };
