import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CoinId } from '../types';

interface FavoriteStore {
  favoriteIds: CoinId[];
  toggleFavorite: (id: CoinId) => void;
}

/** Solo persistimos la selección de favoritos, no precios ni estados de red */
export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (id) => set((state) => ({
        favoriteIds: state.favoriteIds.includes(id)
          ? state.favoriteIds.filter((current) => current !== id)
          : [...state.favoriteIds, id],
      })),
    }),
    {
      name: 'pulso-abierto-favoritos-v3',
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    },
  ),
);
