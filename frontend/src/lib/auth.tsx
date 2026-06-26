import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from './api';

export interface Utilisateur {
  id: number;
  email: string;
  role: string;
}

interface AuthContexte {
  utilisateur: Utilisateur | null;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  inscription: (
    nom: string,
    email: string,
    motDePasse: string,
    rgpdAccepte: boolean,
  ) => Promise<void>;
  deconnexion: () => void;
}

const Contexte = createContext<AuthContexte>(null!);

// Hook pratique : const { utilisateur, connexion } = useAuth();
export const useAuth = () => useContext(Contexte);

export function AuthProvider({ children }: { children: ReactNode }) {
  // On lit l'utilisateur déjà stocké (pour rester connecté après rechargement).
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(() => {
    const u = localStorage.getItem('noru_user');
    return u ? JSON.parse(u) : null;
  });

  function sauvegarder(token: string, u: Utilisateur) {
    localStorage.setItem('noru_token', token);
    localStorage.setItem('noru_user', JSON.stringify(u));
    setUtilisateur(u);
  }

  async function connexion(email: string, motDePasse: string) {
    const r = await api('/auth/login', {
      method: 'POST',
      body: { email, motDePasse },
    });
    sauvegarder(r.access_token, r.utilisateur);
  }

  async function inscription(
    nom: string,
    email: string,
    motDePasse: string,
    rgpdAccepte: boolean,
  ) {
    const r = await api('/auth/register', {
      method: 'POST',
      body: { nom, email, motDePasse, rgpdAccepte },
    });
    sauvegarder(r.access_token, r.utilisateur);
  }

  function deconnexion() {
    localStorage.removeItem('noru_token');
    localStorage.removeItem('noru_user');
    setUtilisateur(null);
  }

  return (
    <Contexte.Provider
      value={{ utilisateur, connexion, inscription, deconnexion }}
    >
      {children}
    </Contexte.Provider>
  );
}
