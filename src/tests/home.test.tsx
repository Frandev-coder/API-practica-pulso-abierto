import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from '../pages/HomePage';
import { COINS } from '../data/coins';
import { fetchCoinPrices } from '../services/coingecko';

vi.mock('../services/coingecko', () => ({ fetchCoinPrices: vi.fn() }));
const prices = COINS.map((coin, index) => ({ coin, usd: [60000, 2000, 100][index] }));

beforeEach(() => vi.mocked(fetchCoinPrices).mockReset());

function openPage() {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
}

describe('Consulta y estados de pantalla', () => {
  it('muestra carga seguida de resultados', async () => {
    const user = userEvent.setup();
    let release!: (data: typeof prices) => void;
    vi.mocked(fetchCoinPrices).mockImplementation(() => new Promise((resolve) => { release = resolve; }));
    openPage();
    await user.click(screen.getByRole('button', { name: /consultar precios/i }));
    expect(screen.getByText('CARGANDO')).toBeInTheDocument();
    release(prices);
    expect(await screen.findByText('CONSULTA EXITOSA')).toBeInTheDocument();
    expect(screen.getByText('3 resultados')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver detalle de bitcoin/i })).toBeInTheDocument();
  });

  it('muestra error y permite reintentar hasta obtener resultados', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchCoinPrices)
      .mockRejectedValueOnce(new Error('Servicio temporalmente no disponible'))
      .mockResolvedValueOnce(prices);
    openPage();
    await user.click(screen.getByRole('button', { name: /consultar precios/i }));
    expect(await screen.findByText('ERROR DE CONSULTA')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /reintentar consulta/i }));
    expect(await screen.findByText('CONSULTA EXITOSA')).toBeInTheDocument();
    await waitFor(() => expect(fetchCoinPrices).toHaveBeenCalledTimes(2));
  });

  it('comunica una respuesta sin resultados', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchCoinPrices).mockResolvedValue([]);
    openPage();
    await user.click(screen.getByRole('button', { name: /consultar precios/i }));
    expect(await screen.findByText('SIN RESULTADOS')).toBeInTheDocument();
  });
});
