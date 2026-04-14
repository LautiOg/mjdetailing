import './ProductCard.css';

const CATEGORY_ICONS = {
  shampoo:    '🧴',
  prelavado:  '🫧',
  cera:       '✨',
  pulidora:   '🔄',
  aspiradora: '💨',
  microfibra: '🧹',
  barro:      '🌱',
  otro:       '📦',
};

const CATEGORY_LABELS = {
  shampoo:    'Shampoo',
  prelavado:  'Prelavado',
  cera:       'Cera',
  pulidora:   'Pulidora',
  aspiradora: 'Aspiradora',
  microfibra: 'Microfibra',
  barro:      'Arcilla',
  otro:       'Otro',
};

function StockBadge({ stock }) {
  if (stock === 0) return <span className="badge badge-out-stock">Sin stock</span>;
  if (stock <= 5)  return <span className="badge badge-low-stock">Últimas {stock} unidades</span>;
  return <span className="badge badge-in-stock">En stock</span>;
}

export default function ProductCard({ product }) {
  const { name, description, category, price, stock, imageUrl } = product;
  const icon = CATEGORY_ICONS[category] || '📦';
  const label = CATEGORY_LABELS[category] || category;

  return (
    <article className={`product-card ${stock === 0 ? 'out-of-stock' : ''}`}>
      <div className="product-card__image">
        {imageUrl ? (
          <img src={imageUrl} alt={name} loading="lazy" />
        ) : (
          <div className="product-card__placeholder">{icon}</div>
        )}
        <span className="product-card__category-pill">{icon} {label}</span>
      </div>

      <div className="product-card__body">
        <div className="product-card__top">
          <h3 className="product-card__name">{name}</h3>
          <StockBadge stock={stock} />
        </div>

        {description && (
          <p className="product-card__desc">{description}</p>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">
            ${price.toLocaleString('es-AR')}
          </span>
          <button
            className="btn btn-primary btn-sm"
            disabled={stock === 0}
          >
            {stock === 0 ? 'Agotado' : 'Consultar'}
          </button>
        </div>
      </div>
    </article>
  );
}
