import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
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
  const [transferts, setTransferts] = useState<Transfert[]>([]);
  const [chargement, setChargement] = useState(true);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes transferts</h1>
        <Link
          to="/nouveau-transfert"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
        >
          + Nouvel envoi
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {chargement ? (
          <p className="text-center text-gray-500 py-8">Chargement…</p>
        ) : transferts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Aucun transfert pour l'instant.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
                <th className="px-4 py-3 font-semibold">Référence</th>
                <th className="px-4 py-3 font-semibold">Bénéficiaire</th>
                <th className="px-4 py-3 font-semibold">Montant</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {transferts.map((t) => (
                <tr key={t.id} className="border-b border-gray-100 text-sm">
                  <td className="px-4 py-3 font-medium">{t.reference}</td>
                  <td className="px-4 py-3">{t.beneficiaire.nomComplet}</td>
                  <td className="px-4 py-3">
                    {t.montantFcfa} FCFA{' '}
                    <span className="text-gray-400">→ {t.montantEur} €</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatutBadge statut={t.statut} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {t.statut === 'EN_ATTENTE' && (
                      <button
                        onClick={() => payer(t.id)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg"
                      >
                        Payer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
