import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import StatutBadge from '../components/StatutBadge';

const STATUTS = ['EN_ATTENTE', 'PAYE', 'ENVOYE', 'RECU', 'ECHEC'];

interface Stats {
  nbTransferts: number;
  nbUtilisateurs: number;
  volumeTotalEur: string;
}

interface TransfertAdmin {
  id: number;
  reference: string;
  montantEur: string;
  statut: string;
  utilisateur: { email: string };
  beneficiaire: { nomComplet: string };
}

export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [transferts, setTransferts] = useState<TransfertAdmin[]>([]);

  async function charger() {
    setStats(await api('/admin/stats'));
    setTransferts(await api('/admin/transferts'));
  }

  useEffect(() => {
    charger();
  }, []);

  async function changerStatut(id: number, statut: string) {
    await api(`/admin/transferts/${id}/statut`, {
      method: 'PATCH',
      body: { statut },
    });
    charger();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Espace administrateur</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xl sm:text-2xl font-bold">{stats?.nbTransferts ?? '—'}</p>
          <p className="text-xs sm:text-sm text-gray-500">Transferts</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xl sm:text-2xl font-bold">{stats?.nbUtilisateurs ?? '—'}</p>
          <p className="text-xs sm:text-sm text-gray-500">Utilisateurs</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xl sm:text-2xl font-bold">{stats?.volumeTotalEur ?? '0'} €</p>
          <p className="text-xs sm:text-sm text-gray-500">Volume total</p>
        </div>
      </div>

      {/* Tous les transferts. overflow-x-auto = le tableau défile sur mobile. */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
              <th className="px-4 py-3 font-semibold">Référence</th>
              <th className="px-4 py-3 font-semibold">Envoyeur</th>
              <th className="px-4 py-3 font-semibold">Bénéficiaire</th>
              <th className="px-4 py-3 font-semibold">Montant</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Changer</th>
            </tr>
          </thead>
          <tbody>
            {transferts.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 text-sm">
                <td className="px-4 py-3 font-medium">{t.reference}</td>
                <td className="px-4 py-3">{t.utilisateur.email}</td>
                <td className="px-4 py-3">{t.beneficiaire.nomComplet}</td>
                <td className="px-4 py-3">{t.montantEur} €</td>
                <td className="px-4 py-3">
                  <StatutBadge statut={t.statut} />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={t.statut}
                    onChange={(e) => changerStatut(t.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                  >
                    {STATUTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
