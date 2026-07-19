const GOOGL_QUOTE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart/GOOGL';

async function getGooglePriceUSD() {
  const res = await fetch(GOOGL_QUOTE_URL);
  if (!res.ok) {
    throw new Error(`Yahoo Finance API error: ${res.status}`);
  }

  const data = await res.json();
  const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
  if (typeof price !== 'number') {
    throw new Error('Could not read GOOGL price from Yahoo Finance response');
  }

  return price;
}

module.exports = { getGooglePriceUSD, GOOGL_QUOTE_URL };
