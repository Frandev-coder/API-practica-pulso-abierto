import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="detail-panel">
      <p className="eyebrow">ERROR 404</p>
      <h1>Esta página no existe</h1>
      <p>La dirección solicitada no pertenece a Pulso Abierto.</p>
      <Link className="primary-link" to="/">Volver al inicio</Link>
    </section>
  );
}
