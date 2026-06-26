import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../lib/api';

interface Beneficiaire {
  id: number;
  nomComplet: string;
  email: string;
  iban: string;
}

export default function Beneficiaires() {
  const [liste, setListe] = useState<Beneficiaire[]>([]);
  const [nomComplet, setNomComplet] = useState('');
  const [email, setEmail] = useState('');
  const [iban, setIban] = useState('');
  const [erreur, setErreur] = useState('');

  async function charger() {
    setListe(await api('/beneficiaires'));
  }

  useEffect(() => {
    charger();
  }, []);

  async function ajouter(e: FormEvent) {
    e.preventDefault();
    setErreur('');
    try {
      await api('/beneficiaires', {
        method: 'POST',
        body: { nomComplet, email, iban },
      });
      setNomComplet('');
      setEmail('');
      setIban('');
      charger();
    } catch (err) {
      setErreur((err as Error).message);
    }
  }

  async function supprimer(id: number) {
    await api(`/beneficiaires/${id}`, { method: 'DELETE' });
    charger();
  }

  const champ =
    'w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes bénéficiaires</h1>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Formulaire d'ajout */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-fit">
          <h2 className="font-semibold mb-4">Ajouter un bénéficiaire</h2>
          <form onSubmit={ajouter} className="space-y-3">
            <input
              placeholder="Nom complet"
              value={nomComplet}
              onChange={(e) => setNomComplet(e.target.value)}
              required
              className={champ}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={champ}
            />
            <input
              placeholder="IBAN (ex : FR76...)"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              required
              className={champ}
            />
            {erreur && <p className="text-sm text-red-600">{erreur}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg"
            >
              Ajouter
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="font-semibold mb-4">Liste ({liste.length})</h2>
          {liste.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun bénéficiaire.</p>
          ) : (
            <ul className="space-y-3">
              {liste.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3"
                >
                  <div>
                    <p className="font-medium">{b.nomComplet}</p>
                    <p className="text-sm text-gray-500">{b.email}</p>
                    <p className="text-xs text-gray-400">{b.iban}</p>
                  </div>
                  <button
                    onClick={() => supprimer(b.id)}
                    className="text-sm text-gray-400 hover:text-red-600"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
