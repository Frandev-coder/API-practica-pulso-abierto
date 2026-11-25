import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchCoinPrices } from '../services/coingecko';

afterEach(() => vi.unstubAllGlobals());

describe('Servicio CoinGecko sin solicitudes reales', () => {
  it('adapta una respuesta HTTP exitosa a datos tipados', async () => {
    const mockedFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ bitcoin: { usd: 60000 }, ethereum: { usd: 2000 }, solana: { usd: 100 } }),
    });
    vi.stubGlobal('fetch', mockedFetch);
    const result = await fetchCoinPrices();
    expect(result.map(({ coin, usd }) => [coin.id, usd])).toEqual([
      ['bitcoin', 60000], ['ethereum', 2000], ['solana', 100],
    ]);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it('informa un error cuando response.ok es false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    await expect(fetchCoinPrices()).rejects.toThrow('HTTP 429');
  });

  it('devuelve una colección vacía si la API no incluye precios válidos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    await expect(fetchCoinPrices()).resolves.toEqual([]);
  });
});
