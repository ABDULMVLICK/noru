import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

// Barre de navigation commune à toutes les pages connectées.
export default function Layout() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function lienClasse(to: string) {
    const actif = pathname === to;
    return `px-3 py-2 rounded-lg text-sm ${
      actif
        ? 'bg-emerald-50 text-emerald-800 font-semibold'
        : 'text-gray-500 hover:bg-gray-100'
    }`;
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center gap-6">
          <Link to="/" className="text-emerald-600 font-extrabold text-xl tracking-wide">
            NORU
          </Link>
          <nav className="flex gap-1 flex-1">
            <Link to="/" className={lienClasse('/')}>
              Mes transferts
            </Link>
            <Link to="/beneficiaires" className={lienClasse('/beneficiaires')}>
              Bénéficiaires
            </Link>
            <Link to="/nouveau-transfert" className={lienClasse('/nouveau-transfert')}>
              Nouvel envoi
            </Link>
            {utilisateur?.role === 'ADMIN' && (
              <Link to="/admin" className={lienClasse('/admin')}>
                Admin
              </Link>
            )}
          </nav>
          <button
            onClick={() => {
              deconnexion();
              navigate('/connexion');
            }}
            className="text-sm text-gray-500 hover:text-red-600"
          >
            Déconnexion
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-5 py-8">
        <Outlet />
      </main>
    </>
  );
}
