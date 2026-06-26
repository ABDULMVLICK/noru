import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Beneficiaires from './pages/Beneficiaires';
import NouveauTransfert from './pages/NouveauTransfert';
import Admin from './pages/Admin';

// Le routeur : quelle page afficher selon l'URL.
export default function App() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />

      {/* Pages protégées (nécessitent d'être connecté) */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/beneficiaires" element={<Beneficiaires />} />
        <Route path="/nouveau-transfert" element={<NouveauTransfert />} />
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
