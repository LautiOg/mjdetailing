import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './AdminDashboard.css';

const EMPTY_FORM = {
  name: '', description: '', category: '',
  price: '', stock: '', imageUrl: '',
};

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch]     = useState('');

  // Categorías existentes derivadas de los productos cargados
  const existingCategories = [...new Set(products.map((p) => p.category))].sort();

  useEffect(() => {
    if (!isAdmin) { navigate('/admin-login'); return; }
    fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch { addToast('Error al cargar productos', 'error'); }
    finally { setLoading(false); }
  };

  const handleStockChange = async (id, delta) => {
    try {
      const res = await api.patch(`/products/${id}/stock`, { delta });
      setProducts((prev) => prev.map((p) => p._id === id ? res.data : p));
    } catch { addToast('Error al actualizar stock', 'error'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      addToast('Producto eliminado', 'success');
    } catch { addToast('Error al eliminar producto', 'error'); }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editId) {
        const res = await api.put(`/products/${editId}`, payload);
        setProducts((prev) => prev.map((p) => p._id === editId ? res.data : p));
        addToast('Producto actualizado', 'success');
      } else {
        const res = await api.post('/products', payload);
        setProducts((prev) => [res.data, ...prev]);
        addToast('Producto creado', 'success');
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Error al guardar', 'error');
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, category: p.category,
      price: p.price, stock: p.stock, imageUrl: p.imageUrl });
    setEditId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAdmin) return null;

  return (
    <main className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Panel de Control</h1>
            <p className="admin-subtitle">{products.length} productos en catálogo</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditId(null); }}
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form className="admin-form glass-card" onSubmit={handleFormSubmit}>
            <h2 className="admin-form__title">{editId ? 'Editar Producto' : 'Agregar Producto'}</h2>
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label>Nombre *</label>
                <input className="input-field" required value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Ej: Shampoo pH Neutro 1L" />
              </div>
              <div className="admin-form__field">
                <label>Categoría * <span className="admin-form__hint">(escribí una nueva o eligí una existente)</span></label>
                <input
                  className="input-field"
                  required
                  list="categories-datalist"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value.toLowerCase()})}
                  placeholder="Ej: lubricante, cristales, pintura..."
                />
                <datalist id="categories-datalist">
                  {existingCategories.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </datalist>
              </div>
              <div className="admin-form__field">
                <label>Precio (ARS) *</label>
                <input className="input-field" type="number" required min="0" value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})} placeholder="0" />
              </div>
              <div className="admin-form__field">
                <label>Stock Inicial *</label>
                <input className="input-field" type="number" required min="0" value={form.stock}
                  onChange={(e) => setForm({...form, stock: e.target.value})} placeholder="0" />
              </div>
              <div className="admin-form__field admin-form__field--full">
                <label>Descripción</label>
                <input className="input-field" value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Descripción breve del producto..." />
              </div>
              <div className="admin-form__field admin-form__field--full">
                <label>URL de Imagen</label>
                <input className="input-field" value={form.imageUrl}
                  onChange={(e) => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            <div className="admin-form__actions">
              <button type="submit" className="btn btn-primary">
                {editId ? '💾 Guardar Cambios' : '✅ Agregar Producto'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditId(null); }}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="admin-search-bar">
          <input
            id="admin-search"
            className="input-field"
            placeholder="🔍  Buscar en inventario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? <div className="spinner" /> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="admin-table__empty">Sin productos</td></tr>
                ) : filtered.map((p) => (
                  <tr key={p._id} className={p.stock === 0 ? 'row-out' : ''}>
                    <td className="admin-table__name">
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="admin-table__thumb" />}
                      <span>{p.name}</span>
                    </td>
                    <td><span className="admin-table__cat">{p.category}</span></td>
                    <td className="admin-table__price">${p.price.toLocaleString('es-AR')}</td>
                    <td>
                      <div className="stock-control">
                        <button className="btn-icon minus" onClick={() => handleStockChange(p._id, -1)} disabled={p.stock === 0}>−</button>
                        <span className={`stock-num ${p.stock === 0 ? 'zero' : p.stock <= 5 ? 'low' : ''}`}>{p.stock}</span>
                        <button className="btn-icon" onClick={() => handleStockChange(p._id, +1)}>+</button>
                      </div>
                    </td>
                    <td>
                      {p.stock === 0
                        ? <span className="badge badge-out-stock">Sin stock</span>
                        : p.stock <= 5
                          ? <span className="badge badge-low-stock">Bajo</span>
                          : <span className="badge badge-in-stock">OK</span>
                      }
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(p)}>✏️ Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
