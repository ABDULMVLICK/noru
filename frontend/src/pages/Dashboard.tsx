import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import StatutBadge from '../components/StatutBadge';

interface Transfert {
  id: number;
  reference: string;
  montantFcfa: string;
  montantEur: string;
  statut: string;
  beneficiaire: { nomComplet: string };
}

export default function Dashboard() {
  const { supprimerCompte } = useAuth();
  const navigate = useNavigate();
  const [transferts, setTransferts] = useState<Transfert[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  async function charger() {
    setTransferts(await api('/transferts'));
    setChargement(false);
  }

  useEffect(() => {
    charger();
  }, []);

  async function payer(id: number) {
    await api(`/transferts/${id}/payer`, { method: 'PATCH' });
    charger();
  }

  // Droit à l'effacement (RGPD) : on demande confirmation car c'est irréversible.
  async function supprimer() {
    if (
      !confirm(
        'Supprimer définitivement votre compte et toutes vos données ? Cette action est irréversible.',
      )
    ) {
      return;
    }
    setErreur('');
    try {
      await supprimerCompte();
      navigate('/connexion');
    } catch (err) {
      setErreur((err as Error).message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Mes transferts</h1>
        <Link
          to="/nouveau-transfert"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
        >
          + Nouvel envoi
        </Link>
      </div>

      {chargement ? (
        <p className="text-center text-stone-500 py-8">Chargement…</p>
      ) : transferts.length === 0 ? (
        <p className="text-center text-stone-500 py-8">
          Aucun transfert pour l'instant.
        </p>
      ) : (
        // Liste de cartes : s'empile sur mobile, reste lisible sur grand écran.
        <div className="space-y-3">
          {transferts.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-stone-200 rounded-xl shadow-sm p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{t.beneficiaire.nomComplet}</p>
                <p className="text-xs text-stone-400">{t.reference}</p>
                <p className="text-sm mt-1">
                  {t.montantFcfa} FCFA{' '}
                  <span className="text-stone-400">→ {t.montantEur} €</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatutBadge statut={t.statut} />
                {t.statut === 'EN_ATTENTE' && (
                  <button
                    onClick={() => payer(t.id)}
                    className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg"
                  >
                    Payer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mon compte — droit à l'effacement prévu par le RGPD. */}
      <div className="mt-10 bg-white border border-stone-200 rounded-xl p-5">
        <h2 className="font-semibold">Mon compte</h2>
        <p className="text-sm text-stone-500 mt-1 mb-3">
          Conformément au RGPD, vous pouvez supprimer votre compte à tout moment.
          Vos bénéficiaires et vos transferts seront définitivement effacés.
        </p>
        {erreur && <p className="text-sm text-red-600 mb-2">{erreur}</p>}
        <button
          onClick={supprimer}
          className="text-sm font-medium border border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg"
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
