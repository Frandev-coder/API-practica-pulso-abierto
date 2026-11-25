import type { Coin, CoinId } from '../types';

export const COINS: readonly Coin[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    description: 'Bitcoin es la primera criptomoneda y se utiliza como una red digital descentralizada.'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '◆',
    description: 'Ethereum es una plataforma de blockchain que permite aplicaciones y contratos inteligentes.'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    description: 'Solana es una red blockchain diseñada para procesar transacciones y aplicaciones.'
  }
];

export function getCoinById(value: string | undefined): Coin | undefined {
  return COINS.find((coin) => coin.id === (value as CoinId));
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(value);
}
