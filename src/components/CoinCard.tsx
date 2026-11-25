import { Link } from 'react-router-dom';
import { formatUsd } from '../data/coins';
import { useFavoriteStore } from '../store/favorites';
import type { CoinPrice } from '../types';

interface CoinCardProps { price: CoinPrice }

export default function CoinCard({ price }: CoinCardProps) {
  const { coin, usd } = price;
  const favorite = useFavoriteStore((state) => state.favoriteIds.includes(coin.id));
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);

  return (
    <article className="coin-card">
      <div className="coin-heading">
        <span className={`coin-icon coin-icon--${coin.id}`} aria-hidden="true">{coin.icon}</span>
        <div><h3>{coin.name}</h3><p className="symbol">{coin.symbol}</p></div>
      </div>
      <p className="price-caption">Precio actual (USD)</p>
      <p className="price-value">{formatUsd(usd)}</p>
      <div className="card-actions">
        <Link className="text-link" to={`/criptomonedas/${coin.id}`}>Ver detalle de {coin.name}</Link>
        <button type="button" className="favorite-button" aria-pressed={favorite}
          aria-label={`${favorite ? 'Quitar' : 'Marcar'} ${coin.name} ${favorite ? 'de favoritos' : 'como favorita'}`}
          onClick={() => toggleFavorite(coin.id)}>
          {favorite ? '★ Favorita' : '☆ Marcar favorita'}
        </button>
      </div>
    </article>
  );
}
