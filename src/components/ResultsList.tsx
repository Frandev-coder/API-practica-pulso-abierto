import CoinCard from './CoinCard';
import type { CoinPrice } from '../types';

interface ResultsListProps { prices: CoinPrice[] }

export default function ResultsList({ prices }: ResultsListProps) {
  return (
    <section className="results-section" aria-labelledby="results-title">
      <div className="results-header">
        <h2 id="results-title">Criptomonedas consultadas</h2>
        <span className="result-count">{prices.length} resultado{prices.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="coin-grid">
        {prices.map((price) => <CoinCard key={price.coin.id} price={price} />)}
      </div>
    </section>
  );
}
