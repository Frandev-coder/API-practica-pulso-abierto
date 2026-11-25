import type { LoadState } from '../types';

interface StatusMessageProps {
  state: LoadState;
  message?: string;
  onRetry?: () => void;
}

const LABELS: Record<LoadState, string> = {
  inicial: 'ESTADO INICIAL',
  carga: 'CARGANDO',
  resultado: 'CONSULTA EXITOSA',
  vacio: 'SIN RESULTADOS',
  error: 'ERROR DE CONSULTA'
};

export default function StatusMessage({ state, message, onRetry }: StatusMessageProps) {
  const defaultText: Record<LoadState, string> = {
    inicial: 'Completá la búsqueda y seleccioná Consultar precios.',
    carga: 'Consultando precios de criptomonedas. Esperá un momento…',
    resultado: 'Los precios se obtuvieron correctamente.',
    vacio: 'No se encontraron datos para mostrar.',
    error: 'No se pudo completar la consulta. Revisá tu conexión e intentá nuevamente.'
  };

  return (
    <section className={`status status--${state}`} role="status" aria-live="polite" aria-busy={state === 'carga'}>
      <strong className="status__label">{LABELS[state]}</strong>
      <p>{message ?? defaultText[state]}</p>
      {state === 'error' && onRetry && (
        <button className="secondary-button" type="button" onClick={onRetry}>Reintentar consulta</button>
      )}
    </section>
  );
}
