import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { useFavoriteStore } from './store/favorites';

export default function App() {
  const favoriteCount = useFavoriteStore((state) => state.favoriteIds.length);
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Pulso Abierto - ir al inicio">
            <span className="brand-mark" aria-hidden="true">₿</span>
            <span>Pulso <strong>Abierto</strong></span>
          </Link>
          <span className="header-note">Frontend · Módulo 3 · {favoriteCount} favorita{favoriteCount !== 1 ? 's' : ''}</span>
        </div>
      </header>
      <main className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/criptomonedas/:id" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>© 2026 Pulso Abierto · React + TypeScript</span>
        <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer">Datos: CoinGecko</a>
      </footer>
    </div>
  );
}
