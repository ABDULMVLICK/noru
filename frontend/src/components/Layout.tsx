import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

// Barre de navigation commune. Pensée mobile d'abord :
//  - 1re ligne : logo + déconnexion
//  - 2e ligne : les liens, qui défilent horizontalement si l'écran est étroit
export default function Layout() {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function lienClasse(to: string) {
    const actif = pathname === to;
    return `whitespace-nowrap px-3 py-2 rounded-lg text-sm ${
      actif
        ? 'bg-brand-100 text-brand-800 font-semibold'
        : 'text-stone-500 hover:bg-stone-100'
    }`;
  }

  return (
    <>
      <header className="bg-brand-50/70 backdrop-blur border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <Link
              to="/"
              className="text-brand-700 font-extrabold text-xl tracking-wide"
            >
              NORU
            </Link>
            <button
              onClick={() => {
                deconnexion();
                navigate('/connexion');
              }}
              className="text-sm text-stone-500 hover:text-red-600"
            >
              Déconnexion
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-2">
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
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}
