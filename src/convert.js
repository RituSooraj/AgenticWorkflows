const { loadRates } = require('./rates');

function convert(amount, from, to) {
  const { rates } = loadRates();
  const fromRate = rates[from.toUpperCase()];
  const toRate = rates[to.toUpperCase()];

  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency: ${!fromRate ? from : to}`);
  }

  const usdAmount = amount / fromRate;
  const converted = usdAmount * toRate;
  return Math.round(converted * 100) / 100;
}

module.exports = { convert };
