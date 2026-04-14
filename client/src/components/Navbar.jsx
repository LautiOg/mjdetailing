import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const LOGO_SVG = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="13" stroke="#00aaff" strokeWidth="1.5"/>
    <path d="M7 17c2-4 5-7 7-7s5 3 7 7" stroke="#00aaff" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="14" cy="10.5" r="2" fill="#00aaff"/>
  </svg>
);

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          {LOGO_SVG}
          <span>Detailing<strong>MJ</strong></span>
        </Link>

        <nav className="navbar-links">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Catálogo</Link>
          {isAdmin && (
            <Link to="/admin" className={pathname.startsWith('/admin') ? 'active' : ''}>
              Panel Admin
            </Link>
          )}
        </nav>

        <div className="navbar-actions">
          {isAdmin ? (
            <button className="btn btn-secondary btn-sm" onClick={logout}>
              Cerrar sesión
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
