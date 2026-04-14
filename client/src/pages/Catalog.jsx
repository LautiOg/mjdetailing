import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import ProductCard from '../components/ProductCard';
import './Catalog.css';

// Catálogo completo de categorías posibles
const ALL_CATEGORIES = [
  { value: 'todos',      label: 'Todos',       icon: '🛒' },
  { value: 'shampoo',    label: 'Shampoo',     icon: '🧴' },
  { value: 'prelavado',  label: 'Prelavado',   icon: '🫧' },
  { value: 'cera',       label: 'Cera',        icon: '✨' },
  { value: 'pulidora',   label: 'Pulidoras',   icon: '🔄' },
  { value: 'aspiradora', label: 'Aspiradoras', icon: '💨' },
  { value: 'microfibra', label: 'Microfibra',  icon: '🧹' },
  { value: 'barro',      label: 'Arcilla',     icon: '🌱' },
  { value: 'otro',       label: 'Otros',       icon: '📦' },
];

export default function Catalog() {
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [category, setCategory]             = useState('todos');
  const [onlyInStock, setOnlyInStock]       = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // Solo las categorías que tienen productos en la DB
  const [availableCategories, setAvailableCategories] = useState(['todos']);

  // Al montar, traemos todos los productos para saber qué categorías existen
  useEffect(() => {
    api.get('/products').then((res) => {
      const cats = new Set(res.data.map((p) => p.category));
      setAvailableCategories(['todos', ...cats]);
    }).catch(() => {});
  }, []);

  // Categorías filtradas: solo las que existen en la DB
  const visibleCategories = ALL_CATEGORIES.filter(
    (cat) => availableCategories.includes(cat.value)
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category !== 'todos') params.category = category;
      if (onlyInStock) params.inStock = 'true';
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, onlyInStock]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <main className="catalog-page">
      {/* Hero */}
      <section className="catalog-hero">
        <div className="catalog-hero__glow" />
        <div className="container">
          <h1 className="catalog-hero__title">
            Tu auto merece <span>lo mejor.</span>
          </h1>
          <p className="catalog-hero__subtitle">
            Productos de detailing profesional para una limpieza y cuidado impecables.
          </p>
        </div>
      </section>

      <div className="container catalog-body">
        {/* Filters */}
        <aside className="catalog-filters">
          <div className="catalog-search-wrap">
            <span className="catalog-search-icon">🔍</span>
            <input
              id="search-input"
              className="input-field catalog-search-input"
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="catalog-filter-group">
            <span className="catalog-filter-label">Categoría</span>
            <div className="catalog-categories">
              {visibleCategories.map((cat) => (
                <button
                  key={cat.value}
                  className={`category-chip ${category === cat.value ? 'active' : ''}`}
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          <label className="catalog-toggle">
            <span className="catalog-toggle__track">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span className="catalog-toggle__slider" />
            </span>
            Solo productos en stock
          </label>
        </aside>

        {/* Grid */}
        <section className="catalog-grid-area">
          <div className="catalog-result-count">
            {!loading && (
              <span>
                {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="catalog-empty">
              <span>😔</span>
              <p>No se encontraron productos con esos filtros.</p>
            </div>
          ) : (
            <div className="catalog-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
