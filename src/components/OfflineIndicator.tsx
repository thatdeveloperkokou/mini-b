import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Language } from '../types';

export const OfflineIndicator: React.FC<{ lang: Language }> = ({ lang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg md:bottom-5"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>
        {lang === 'fr'
          ? 'Mode Hors-Ligne — Catalogue & panier enregistrés localement'
          : 'Offline Mode — Cached catalog & local cart active'}
      </span>
    </div>
  );
};
