import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Register() {
  const { inscription } = useAuth();
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [rgpd, setRgpd] = useState(false);
  const [erreur, setErreur] = useState('');

  async function soumettre(e: FormEvent) {
    e.preventDefault();
    setErreur('');
    try {
      await inscription(nom, email, motDePasse, rgpd);
      navigate('/');
    } catch (err) {
      setErreur((err as Error).message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-5">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-extrabold tracking-widest text-emerald-600 text-center">
          NORU
        </h1>
        <p className="text-center text-gray-500 mb-6">Créez votre compte</p>

        <form onSubmit={soumettre} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Nom</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Mot de passe (8 caractères min.)
            </label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={rgpd}
              onChange={(e) => setRgpd(e.target.checked)}
            />
            J'accepte la politique de confidentialité (RGPD)
          </label>

          {erreur && <p className="text-sm text-red-600">{erreur}</p>}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg"
          >
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-emerald-600 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
