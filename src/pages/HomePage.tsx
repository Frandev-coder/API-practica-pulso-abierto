import { useRef, useState } from 'react';
import QueryForm from '../components/QueryForm';
import ResultsList from '../components/ResultsList';
import StatusMessage from '../components/StatusMessage';
import { fetchCoinPrices } from '../services/coingecko';
import type { CoinPrice, DemoMode, LoadState, QueryOptions } from '../types';

const DEFAULT_QUERY: QueryOptions = { search: 'todas', order: 'nombre' };

// Una sola función para aplicar el mismo filtro en la vista y al contar resultados.
function coinMatchesSearch(coin: CoinPrice['coin'], search: string): boolean {
  const needle = search.trim().toLocaleLowerCase('es');
  return needle === 'todas' ||
    [coin.name, coin.symbol, coin.id].some((text) => text.toLocaleLowerCase('es').includes(needle));
}

export default function HomePage() {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [status, setStatus] = useState<LoadState>('inicial');
  const [message, setMessage] = useState<string>();
  const [lastQuery, setLastQuery] = useState<QueryOptions>(DEFAULT_QUERY);
  const [lastDemo, setLastDemo] = useState<DemoMode>('normal');
  const [lastDelayed, setLastDelayed] = useState(false);
  const requestId = useRef(0);

  // Cantidad y colección visible son datos derivados, nunca estados duplicados.
  const visible = prices
    .filter(({ coin }) => coinMatchesSearch(coin, lastQuery.search))
    .sort((a, b) => lastQuery.order === 'precio'
      ? b.usd - a.usd
      : a.coin.name.localeCompare(b.coin.name, 'es'));


  async function runQuery(query: QueryOptions, demo: DemoMode, delayed: boolean) {
    const currentId = ++requestId.current;
    setLastQuery(query);
    setLastDemo(demo);
    setLastDelayed(delayed);
    setPrices([]);
    setMessage(undefined);
    setStatus('carga');
    try {
      if (delayed) await new Promise<void>((resolve) => setTimeout(resolve, 4000));
      if (currentId !== requestId.current) return;
      if (demo === 'error') throw new Error('Error simulado para probar la recuperación.');
      const data = demo === 'vacio' ? [] : await fetchCoinPrices();
      if (currentId !== requestId.current) return;
      setPrices(data);
      const filteredCount = data.filter(({ coin }) => coinMatchesSearch(coin, query.search)).length;
      setStatus(filteredCount > 0 ? 'resultado' : 'vacio');
      setMessage(filteredCount > 0
        ? `${filteredCount} cotización(es) disponible(s) en dólares estadounidenses.`
        : demo === 'vacio' ? 'Respuesta vacía simulada para comprobar la interfaz.' : 'La consulta terminó, pero no hay coincidencias con la búsqueda.');
    } catch (error: unknown) {
      if (currentId !== requestId.current) return;
      setPrices([]);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Ocurrió un error inesperado durante la consulta.');
    }
  }

  return (
    <>
      <section className="intro" aria-labelledby="page-heading">
        <p className="eyebrow">COTIZACIONES EN TIEMPO REAL</p>
        <h1 id="page-heading">Precios de criptomonedas</h1>
        <p>Consultá Bitcoin, Ethereum y Solana mediante CoinGecko. Filtrá, ordená y descubrí más información.</p>
      </section>
      <section className="search-panel" aria-label="Formulario de consulta">
        <div className="panel-title"><h2>Consultar precios</h2><span>Moneda: USD</span></div>
        <QueryForm onSearch={(query, demo, delayed) => void runQuery(query, demo, delayed)} busy={status === 'carga'} />
      </section>
      <StatusMessage state={status} message={message}
        onRetry={() => void runQuery(lastQuery, lastDemo, lastDelayed)} />
      {status === 'resultado' && visible.length > 0 &&
        <ResultsList prices={visible} />}
      {status === 'resultado' && visible.length === 0 &&
        <p className="empty-results">No hay criptomonedas que coincidan con ese filtro.</p>}
    </>
  );
}
