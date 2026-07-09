import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

// Même taux que côté backend (pour l'aperçu en temps réel). Les frais de 2 %
// sont appliqués par le backend ; ici on affiche juste le montant converti.
const TAUX = 655.957;

// Moyens de paiement proposés (visuel : c'est une simulation de mobile money).
const METHODES = ['MTN Money', 'Moov Money', 'Carte'];

interface Beneficiaire {
  id: number;
  nomComplet: string;
}

export default function NouveauTransfert() {
  const navigate = useNavigate();
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [beneficiaireId, setBeneficiaireId] = useState('');
  const [montant, setMontant] = useState('');
  const [methode, setMethode] = useState('MTN Money');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api('/beneficiaires').then(setBeneficiaires);
  }, []);

  // Aperçu calculé localement (le backend refait le vrai calcul).
  const montantNum = Number(montant) || 0;
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
      <h1 className="text-2xl font-bold">Nouvel envoi</h1>
      <p className="text-sm text-stone-500 mb-6">
        Bénin → France · réception en quelques minutes
      </p>

      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-6">
        {beneficiaires.length === 0 ? (
          <p className="text-stone-600 text-sm">
            Vous devez d'abord{' '}
            <Link to="/beneficiaires" className="text-brand-700 font-medium">
              ajouter un bénéficiaire
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={envoyer} className="space-y-5">
            {/* Grande carte de conversion */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
              {/* Ce que l'expéditeur envoie */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Vous envoyez
                  </p>
                  <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    min={500}
                    required
                    placeholder="0"
                    className="w-full bg-transparent text-3xl font-bold text-stone-800 outline-none placeholder:text-stone-300"
                  />
                </div>
                <span className="shrink-0 bg-white border border-brand-200 text-brand-700 font-semibold text-sm px-3 py-1.5 rounded-full">
                  FCFA
                </span>
              </div>

              {/* Flèche de conversion */}
              <div className="flex items-center gap-3 my-3">
                <div className="h-px flex-1 bg-brand-200/60" />
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm">
                  ↓
                </div>
                <div className="h-px flex-1 bg-brand-200/60" />
              </div>

              {/* Ce que le bénéficiaire reçoit */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Le bénéficiaire reçoit
                  </p>
                  <p className="text-3xl font-bold text-brand-700">{eur}</p>
                </div>
                <span className="shrink-0 bg-white border border-brand-200 text-brand-700 font-semibold text-sm px-3 py-1.5 rounded-full">
                  EUR
                </span>
              </div>

              <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-brand-100">
                Taux : 1 € = 655,957 FCFA · Frais NORU : 2 %
              </p>
            </div>

            {/* Choix du bénéficiaire */}
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1">
                Bénéficiaire
              </label>
              <select
                value={beneficiaireId}
                onChange={(e) => setBeneficiaireId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-500"
              >
                <option value="">— Choisir —</option>
                {beneficiaires.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nomComplet}
                  </option>
                ))}
              </select>
            </div>

            {/* Méthode de paiement (visuel : simulation mobile money) */}
            <div>
              <label className="block text-sm font-semibold text-stone-600 mb-1">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-3 gap-2">
                {METHODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethode(m)}
                    className={`py-2 rounded-lg text-sm font-medium border ${
                      methode === m
                        ? 'bg-brand-100 border-brand-300 text-brand-800'
                        : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {erreur && <p className="text-sm text-red-600">{erreur}</p>}

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl"
            >
              Envoyer {montantNum > 0 ? `${montantNum.toLocaleString('fr-FR')} FCFA` : ''}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
