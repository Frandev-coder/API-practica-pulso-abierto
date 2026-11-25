import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Al ejecutar Vitest con versiones recientes de Node, el localStorage
// experimental de Node puede interferir con el que ofrece jsdom.
// Este almacenamiento aislado se utiliza solamente en las pruebas.
const values = new Map<string, string>();
const testStorage: Storage = {
  get length() {
    return values.size;
  },
  clear() {
    values.clear();
  },
  getItem(key: string) {
    return values.get(String(key)) ?? null;
  },
  key(index: number) {
    return [...values.keys()][index] ?? null;
  },
  removeItem(key: string) {
    values.delete(String(key));
  },
  setItem(key: string, value: string) {
    values.set(String(key), String(value));
  },
};

Object.defineProperty(window, 'localStorage', {
  configurable: true,
  value: testStorage,
});
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: testStorage,
});

afterEach(() => cleanup());
