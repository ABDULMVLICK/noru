import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

// Si l'utilisateur n'est pas connecté, on le renvoie vers la page de connexion.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { utilisateur } = useAuth();
  if (!utilisateur) {
    return <Navigate to="/connexion" replace />;
  }
  return <>{children}</>;
}
