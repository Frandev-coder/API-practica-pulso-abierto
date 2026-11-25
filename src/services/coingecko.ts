import { COINS } from '../data/coins';
import type { CoinPrice } from '../types';

export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd';

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

/** Acceso externo y validación básica del JSON, separados de los componentes. */
export async function fetchCoinPrices(signal?: AbortSignal): Promise<CoinPrice[]> {
  const response = await fetch(COINGECKO_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal
  });
  if (!response.ok) {
    throw new Error(`CoinGecko devolvió un error HTTP ${response.status}.`);
  }
  const json: unknown = await response.json();
  if (!isRecord(json)) throw new Error('La respuesta de la API no tiene el formato esperado.');

  return COINS.flatMap((coin): CoinPrice[] => {
    const item = json[coin.id];
    if (!isRecord(item)) return [];
    const price = item['usd'];
    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) return [];
    return [{ coin, usd: price }];
  });
}
