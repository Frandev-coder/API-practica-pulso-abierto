import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage';
import { formatUsd, getCoinById } from '../data/coins';
import { fetchCoinPrices } from '../services/coingecko';
import { useFavoriteStore } from '../store/favorites';
import type { CoinPrice, LoadState } from '../types';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const coin = getCoinById(id);
  const favorite = useFavoriteStore((state) => coin ? state.favoriteIds.includes(coin.id) : false);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const [status, setStatus] = useState<LoadState>('carga');
  const [price, setPrice] = useState<CoinPrice>();
  const [message, setMessage] = useState<string>();
  const [retryIndex, setRetryIndex] = useState(0);

  useEffect(() => {
    if (!coin) return;
    const controller = new AbortController();
    setStatus('carga');
    setMessage(undefined);
    setPrice(undefined);
    fetchCoinPrices(controller.signal)
      .then((data) => {
        const match = data.find((item) => item.coin.id === coin.id);
        if (match) { setPrice(match); setStatus('resultado'); }
        else { setStatus('vacio'); setMessage(`CoinGecko no devolvió un precio para ${coin.name}.`); }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Error inesperado al consultar la API.');
      });
    return () => controller.abort();
  }, [coin?.id, retryIndex]);

  if (!coin) return (
    <section className="detail-panel">
      <p className="eyebrow">RECURSO NO ENCONTRADO</p>
      <h1>Criptomoneda inexistente</h1>
      <p>La dirección no corresponde a Bitcoin, Ethereum ni Solana.</p>
      <Link className="primary-link" to="/">Volver a las cotizaciones</Link>
    </section>
  );

  return (
    <section className="detail-panel">
      <p className="eyebrow">DETALLE DE CRIPTOMONEDA</p>
      <div className="detail-heading">
        <span className={`coin-icon coin-icon--${coin.id}`} aria-hidden="true">{coin.icon}</span>
        <div><h1>{coin.name}</h1><p className="symbol">{coin.symbol}</p></div>
      </div>
      <p>{coin.description}</p>
      <button type="button" className="favorite-button detail-favorite" aria-pressed={favorite}
        onClick={() => toggleFavorite(coin.id)}>
        {favorite ? '★ Quitar de favoritos' : '☆ Marcar como favorita'}
      </button>
      <StatusMessage state={status} message={message} onRetry={() => setRetryIndex((n) => n + 1)} />
      {status === 'resultado' && price && (
        <div className="detail-price">
          <p>Precio actual en dólares estadounidenses</p>
          <strong>{formatUsd(price.usd)}</strong>
          <small>Fuente: CoinGecko (consulta al abrir esta vista).</small>
        </div>
      )}
      <Link className="primary-link" to="/">← Volver a los resultados</Link>
    </section>
  );
}
