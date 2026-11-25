export type CoinId = 'bitcoin' | 'ethereum' | 'solana';
export type OrderBy = 'nombre' | 'precio';
export type LoadState = 'inicial' | 'carga' | 'resultado' | 'vacio' | 'error';
export type DemoMode = 'normal' | 'vacio' | 'error';

export interface Coin {
  id: CoinId;
  name: string;
  symbol: string;
  icon: string;
  description: string;
}

export interface CoinPrice {
  coin: Coin;
  usd: number;
}

export interface QueryOptions {
  search: string;
  order: OrderBy;
}
