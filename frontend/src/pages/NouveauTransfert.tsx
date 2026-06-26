import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

// Mêmes constantes que côté backend (pour l'aperçu en temps réel).
const TAUX = 655.957;
const FRAIS = 0.02;

interface Beneficiaire {
  id: number;
  nomComplet: string;
}

export default function NouveauTransfert() {
  const navigate = useNavigate();
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [beneficiaireId, setBeneficiaireId] = useState('');
  const [montant, setMontant] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api('/beneficiaires').then(setBeneficiaires);
  }, []);

  // Aperçu calculé localement (le backend refait le vrai calcul).
  const montantNum = Number(montant) || 0;
  const frais = Math.round(montantNum * FRAIS * 100) / 100;
  const eur = Math.round((montantNum / TAUX) * 100) / 100;

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    setErreur('');
    try {
      await api('/transferts', {
        method: 'POST',
        body: { beneficiaireId: Number(beneficiaireId), montantFcfa: montantNum },
      });
      navigate('/');
    } catch (err) {
      setErreur((err as Error).message);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Nouvel envoi</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        {beneficiaires.length === 0 ? (
          <p className="text-gray-600 text-sm">
            Vous devez d'abord{' '}
            <Link to="/beneficiaires" className="text-emerald-600 font-medium">
              ajouter un bénéficiaire
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={envoyer} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Bénéficiaire
              </label>
              <select
                value={beneficiaireId}
                onChange={(e) => setBeneficiaireId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
              >
                <option value="">— Choisir —</option>
                {beneficiaires.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nomComplet}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Montant à envoyer (FCFA)
              </label>
              <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                min={500}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Aperçu de la conversion */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Frais NORU (2 %)</span>
                <span className="font-medium">{frais} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Le bénéficiaire reçoit</span>
                <span className="font-semibold text-emerald-700">{eur} €</span>
              </div>
            </div>

            {erreur && <p className="text-sm text-red-600">{erreur}</p>}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg"
            >
              Créer le transfert
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
