import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import CoinCard from '../components/CoinCard';
import { COINS } from '../data/coins';
import { useFavoriteStore } from '../store/favorites';

beforeEach(() => {
  window.localStorage.clear();
  act(() => useFavoriteStore.setState({ favoriteIds: [] }));
});

describe('Favoritos compartidos y persistentes', () => {
  it('permite marcar y desmarcar una moneda y cambia el botón', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CoinCard price={{ coin: COINS[0], usd: 45000 }} /></MemoryRouter>);
    const mark = screen.getByRole('button', { name: /marcar bitcoin como favorita/i });
    expect(mark).toHaveAttribute('aria-pressed', 'false');
    await user.click(mark);
    expect(screen.getByRole('button', { name: /quitar bitcoin de favoritos/i }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(useFavoriteStore.getState().favoriteIds).toEqual(['bitcoin']);
    await user.click(screen.getByRole('button', { name: /quitar bitcoin de favoritos/i }));
    expect(useFavoriteStore.getState().favoriteIds).toEqual([]);
  });

  it('guarda solamente favoritos en el almacenamiento local', () => {
    act(() => useFavoriteStore.getState().toggleFavorite('ethereum'));
    const value = JSON.parse(window.localStorage.getItem('pulso-abierto-favoritos-v3') ?? '{}') as {
      state?: { favoriteIds?: string[]; status?: string };
    };
    expect(value.state?.favoriteIds).toEqual(['ethereum']);
    expect(value.state?.status).toBeUndefined();
    act(() => useFavoriteStore.getState().toggleFavorite('ethereum'));
    const after = JSON.parse(window.localStorage.getItem('pulso-abierto-favoritos-v3') ?? '{}') as {
      state?: { favoriteIds?: string[] };
    };
    expect(after.state?.favoriteIds).toEqual([]);
  });
});
