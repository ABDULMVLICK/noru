// Affiche le statut d'un transfert avec une couleur selon l'état.
const couleurs: Record<string, string> = {
  EN_ATTENTE: 'bg-gray-100 text-gray-600',
  PAYE: 'bg-blue-100 text-blue-700',
  ENVOYE: 'bg-amber-100 text-amber-700',
  RECU: 'bg-emerald-100 text-emerald-700',
  ECHEC: 'bg-red-100 text-red-700',
};

export default function StatutBadge({ statut }: { statut: string }) {
  const classe = couleurs[statut] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${classe}`}>
      {statut}
    </span>
  );
}
