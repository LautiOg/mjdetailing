import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      addToast('¡Bienvenido, administrador!', 'success');
      navigate('/admin');
    } catch {
      addToast('Credenciales incorrectas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-glow" />
      <form className="admin-login-card glass-card" onSubmit={handleSubmit}>
        <div className="admin-login-icon">🔐</div>
        <h1 className="admin-login-title">Acceso Admin</h1>
        <p className="admin-login-subtitle">Panel de administración — DetaingMJ</p>

        <div className="admin-login-fields">
          <input
            id="admin-username"
            className="input-field"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
          <input
            id="admin-password"
            className="input-field"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
