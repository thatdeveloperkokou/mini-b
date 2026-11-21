import React, { useState } from 'react';
import { Download, Share, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallButtonProps {
  lang: Language;
  variant?: 'compact' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang,
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    if (variant === 'banner') {
      return (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {lang === 'fr'
              ? 'Application MINI-B installée en mode autonome'
              : 'MINI-B app installed in standalone mode'}
          </span>
        </div>
      );
    }
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <button
          type="button"
          onClick={handleAction}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#4F28E8] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3F1CC9] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span>{lang === 'fr' ? "Installer l'App MINI-B" : 'Install MINI-B App'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAction}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-[#4F28E8]/25 bg-[#4F28E8]/8 px-3 py-1.5 text-xs font-semibold text-[#4F28E8] transition-colors hover:bg-[#4F28E8]/15 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span>{isIOS ? 'iOS App' : lang === 'fr' ? 'Installer App' : 'Install App'}</span>
        </button>
      )}

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4F28E8] text-white">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 id="pwa-install-title" className="font-display text-base font-bold text-slate-900">
                    {lang === 'fr' ? 'Installer MINI-B sur votre appareil' : 'Install MINI-B on your device'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'fr'
                      ? 'Accès instantané · Catalogue hors-ligne'
                      : 'Instant launch · Offline catalog ready'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Fermer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isIOS ? (
              <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                <p className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white font-mono text-xs font-bold text-[#4F28E8] shadow-xs">
                    1
                  </span>
                  <span>
                    {lang === 'fr' ? 'Touchez le bouton ' : 'Tap the '}
                    <strong className="inline-flex items-center gap-1 text-slate-900">
                      <Share className="h-3.5 w-3.5 text-[#4F28E8]" />
                      {lang === 'fr' ? 'Partager' : 'Share'}
                    </strong>{' '}
                    {lang === 'fr' ? 'dans Safari.' : 'in Safari toolbar.'}
                  </span>
                </p>
                <p className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white font-mono text-xs font-bold text-[#4F28E8] shadow-xs">
                    2
                  </span>
                  <span>
                    {lang === 'fr'
                      ? 'Faites défiler et touchez « Sur l’écran d’accueil ».'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </span>
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                <p>
                  {lang === 'fr'
                    ? 'Ouvrez le menu de votre navigateur (Chrome, Edge ou Samsung Internet) puis sélectionnez « Installer l’application » ou « Ajouter à l’écran d’accueil ».'
                    : 'Open your browser menu (Chrome, Edge, or Samsung Internet) and choose "Install app" or "Add to Home screen".'}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 cursor-pointer"
            >
              {lang === 'fr' ? 'Compris' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
