import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import type { DemoMode, OrderBy, QueryOptions } from '../types';

const schema = z.object({
  search: z.string().trim().min(2, 'Ingresá al menos dos caracteres, o escribí "todas".'),
  order: z.enum(['nombre', 'precio'], { errorMap: () => ({ message: 'Seleccioná un orden válido.' }) })
});

type Errors = Partial<Record<'search' | 'order', string>>;

interface QueryFormProps {
  onSearch: (query: QueryOptions, demo: DemoMode, delayed: boolean) => void;
  busy: boolean;
}

export default function QueryForm({ onSearch, busy }: QueryFormProps) {
  const [search, setSearch] = useState('todas');
  const [order, setOrder] = useState<OrderBy>('nombre');
  const [errors, setErrors] = useState<Errors>({});
  const [demo, setDemo] = useState<DemoMode>('normal');
  const [delayed, setDelayed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ search, order });
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if ((field === 'search' || field === 'order') && !next[field]) next[field] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSearch({ search: result.data.search, order: result.data.order }, demo, delayed);
  }

  return (
    <form className="query-form" onSubmit={handleSubmit} noValidate>
      <div className="form-fields">
        <div className="field">
          <label htmlFor="search-input">Buscar criptomoneda</label>
          <input id="search-input" type="text" value={search} disabled={busy}
            placeholder="Bitcoin, ETH, Solana o todas" aria-invalid={Boolean(errors.search)}
            aria-describedby={errors.search ? 'search-error' : 'search-help'}
            onChange={(event) => { setSearch(event.target.value); if (errors.search) setErrors((previous) => ({ ...previous, search: undefined })); }} />
          <small id="search-help">Escribí «todas» para ver las tres criptomonedas.</small>
          {errors.search && <small className="field-error" id="search-error">Error: {errors.search}</small>}
        </div>
        <div className="field">
          <label htmlFor="sort-select">Ordenar resultados por</label>
          <select id="sort-select" value={order} disabled={busy} aria-invalid={Boolean(errors.order)}
            aria-describedby={errors.order ? 'order-error' : undefined}
            onChange={(event) => setOrder(event.target.value as OrderBy)}>
            <option value="nombre">Nombre (A–Z)</option>
            <option value="precio">Precio (mayor a menor)</option>
          </select>
          {errors.order && <small className="field-error" id="order-error">Error: {errors.order}</small>}
        </div>
      </div>
      <details className="test-controls">
        <summary>Pruebas de estados (para verificar la actividad)</summary>
        <div className="test-options">
          <label htmlFor="demo-mode">Simulación</label>
          <select id="demo-mode" value={demo} disabled={busy}
            onChange={(event) => setDemo(event.target.value as DemoMode)}>
            <option value="normal">Consulta real a CoinGecko</option>
            <option value="vacio">Simular respuesta sin datos</option>
            <option value="error">Simular error de la consulta</option>
          </select>
          <label className="check-row" htmlFor="delay-load">
            <input id="delay-load" type="checkbox" checked={delayed} disabled={busy}
              onChange={(event) => setDelayed(event.target.checked)} />
            Mantener el estado de carga 4 segundos
          </label>
        </div>
      </details>
      <button className="primary-button" disabled={busy} type="submit">
        {busy ? 'Consultando precios…' : 'Consultar precios'}
      </button>
    </form>
  );
}
