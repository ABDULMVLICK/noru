import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
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

interface UtilisateurAdmin {
  id: number;
  email: string;
  nom: string;
  role: string;
}

export default function Admin() {
  const { utilisateur } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [transferts, setTransferts] = useState<TransfertAdmin[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurAdmin[]>([]);

  // Champs du formulaire de création d'utilisateur.
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('USER');
  const [erreur, setErreur] = useState('');

  async function charger() {
    setStats(await api('/admin/stats'));
    setTransferts(await api('/admin/transferts'));
    setUtilisateurs(await api('/admin/utilisateurs'));
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

  async function supprimerTransfert(id: number) {
    if (!confirm('Supprimer ce transfert ?')) return;
    await api(`/admin/transferts/${id}`, { method: 'DELETE' });
    charger();
  }

  async function creerUtilisateur(e: FormEvent) {
    e.preventDefault();
    setErreur('');
    try {
      await api('/admin/utilisateurs', {
        method: 'POST',
        body: { nom, email, motDePasse, role },
      });
      setNom('');
      setEmail('');
      setMotDePasse('');
      setRole('USER');
      charger();
    } catch (err) {
      setErreur((err as Error).message);
    }
  }

  async function changerRole(id: number, nouveauRole: string) {
    await api(`/admin/utilisateurs/${id}/role`, {
      method: 'PATCH',
      body: { role: nouveauRole },
    });
    charger();
  }

  async function supprimerUtilisateur(id: number) {
    if (!confirm('Supprimer cet utilisateur et ses données ?')) return;
    await api(`/admin/utilisateurs/${id}`, { method: 'DELETE' });
    charger();
  }

  const champ =
    'w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-brand-500';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Espace administrateur</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <p className="text-xl sm:text-2xl font-bold">{stats?.nbTransferts ?? '—'}</p>
          <p className="text-xs sm:text-sm text-stone-500">Transferts</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <p className="text-xl sm:text-2xl font-bold">{stats?.nbUtilisateurs ?? '—'}</p>
          <p className="text-xs sm:text-sm text-stone-500">Utilisateurs</p>
        </div>
        <div className="bg-brand-600 border border-brand-600 rounded-xl p-4 text-white">
          <p className="text-xl sm:text-2xl font-bold">{stats?.volumeTotalEur ?? '0'} €</p>
          <p className="text-xs sm:text-sm text-brand-100">Volume total</p>
        </div>
      </div>

      {/* Transferts */}
      <h2 className="text-lg font-semibold mb-3">Tous les transferts</h2>
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-x-auto mb-8">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="text-left text-stone-500 text-sm border-b border-stone-200">
              <th className="px-4 py-3 font-semibold">Référence</th>
              <th className="px-4 py-3 font-semibold">Envoyeur</th>
              <th className="px-4 py-3 font-semibold">Bénéficiaire</th>
              <th className="px-4 py-3 font-semibold">Montant</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transferts.map((t) => (
              <tr key={t.id} className="border-b border-stone-100 text-sm">
                <td className="px-4 py-3 font-medium">{t.reference}</td>
                <td className="px-4 py-3">{t.utilisateur.email}</td>
                <td className="px-4 py-3">{t.beneficiaire.nomComplet}</td>
                <td className="px-4 py-3">{t.montantEur} €</td>
                <td className="px-4 py-3">
                  <StatutBadge statut={t.statut} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={t.statut}
                      onChange={(e) => changerStatut(t.id, e.target.value)}
                      className="border border-stone-200 rounded-lg px-2 py-1 text-sm"
                    >
                      {STATUTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => supprimerTransfert(t.id)}
                      className="text-sm text-stone-400 hover:text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Utilisateurs */}
      <h2 className="text-lg font-semibold mb-3">Utilisateurs</h2>

      {/* Formulaire de création */}
      <form
        onSubmit={creerUtilisateur}
        className="bg-white border border-stone-200 rounded-xl shadow-sm p-4 mb-4 grid gap-3 sm:grid-cols-5"
      >
        <input placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required className={champ} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className={champ} />
        <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required className={champ} />
        <select value={role} onChange={(e) => setRole(e.target.value)} className={champ}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 rounded-lg">
          Ajouter
        </button>
      </form>
      {erreur && <p className="text-sm text-red-600 mb-4">{erreur}</p>}

      {/* Liste des utilisateurs */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left text-stone-500 text-sm border-b border-stone-200">
              <th className="px-4 py-3 font-semibold">Nom</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Rôle</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => (
              <tr key={u.id} className="border-b border-stone-100 text-sm">
                <td className="px-4 py-3 font-medium">{u.nom}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changerRole(u.id, e.target.value)}
                    className="border border-stone-200 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  {u.id === utilisateur?.id ? (
                    <span className="text-xs text-stone-400">(vous)</span>
                  ) : (
                    <button
                      onClick={() => supprimerUtilisateur(u.id)}
                      className="text-sm text-stone-400 hover:text-red-600"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
