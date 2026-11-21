import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  HelpCircle,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCheck,
  Wallet,
  X,
} from 'lucide-react';
import { formatFCFA } from '../data/storeData';
import {
  AccountSection,
  BeninAddress,
  Language,
  UserProfile,
  WalletTransaction,
} from '../types';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface AccountWalletViewProps {
  lang: Language;
  section: AccountSection;
  onChangeSection: (section: AccountSection) => void;
  user: UserProfile;
  walletBalance: number;
  transactions: WalletTransaction[];
  addresses: BeninAddress[];
  ordersCount: number;
  wishlistCount: number;
  onTopUpWallet: (amount: number, channel: string) => void;
  onAddAddress: (addr: Omit<BeninAddress, 'id'>) => void;
  onSetDefaultAddress: (id: string) => void;
  onDeleteAddress: (id: string) => void;
  onToggleAuth: (phone?: string) => void;
  onOpenOrders: () => void;
  onOpenWishlist: () => void;
}

export const AccountWalletView: React.FC<AccountWalletViewProps> = ({
  lang,
  section,
  onChangeSection,
  user,
  walletBalance,
  transactions,
  addresses,
  ordersCount,
  wishlistCount,
  onTopUpWallet,
  onAddAddress,
  onSetDefaultAddress,
  onDeleteAddress,
  onToggleAuth,
  onOpenOrders,
  onOpenWishlist,
}) => {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(25000);
  const [topUpChannel, setTopUpChannel] = useState<'MTN MoMo' | 'Crypto USDT (TRC20)'>('MTN MoMo');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const [newLabel, setNewLabel] = useState('');
  const [newCity, setNewCity] = useState('Cotonou');
  const [newDistrict, setNewDistrict] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPhone, setNewPhone] = useState('+229 97 00 11 22');

  // Auth OTP Flow State
  const [authPhone, setAuthPhone] = useState('97 12 45 80');
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone');
  const [otpDigits, setOtpDigits] = useState<string[]>(['8', '4', '9', '']);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newDistrict.trim() || !newLandmark.trim()) return;
    onAddAddress({
      label: newLabel.trim(),
      city: newCity,
      district: newDistrict.trim(),
      landmark: newLandmark.trim(),
      contactName: user.name,
      phone: newPhone,
      tag: 'Domicile',
      isDefault: false,
    });
    setNewLabel('');
    setNewDistrict('');
    setNewLandmark('');
    setShowAddressForm(false);
  };

  const handleKeypadTap = (val: string) => {
    if (val === 'C') {
      setOtpDigits(['', '', '', '']);
      return;
    }
    if (val === 'BACK') {
      const next = [...otpDigits];
      const idx = next.findLastIndex((d) => d !== '');
      if (idx >= 0) next[idx] = '';
      setOtpDigits(next);
      return;
    }
    const emptyIdx = otpDigits.findIndex((d) => d === '');
    if (emptyIdx >= 0) {
      const next = [...otpDigits];
      next[emptyIdx] = val;
      setOtpDigits(next);
    }
  };

  const faqs = [
    {
      qFr: 'Comment fonctionnent les paiements par MTN MoMo et Moov Flooz ?',
      qEn: 'How do MTN MoMo and Moov Flooz payments work?',
      aFr: 'Lors du paiement, saisissez votre numéro béninois (+229). Un message USSD sécurisé s’affiche sur votre téléphone pour saisir votre code secret.',
      aEn: 'At checkout, enter your +229 number. An encrypted USSD push appears directly on your phone for PIN confirmation.',
    },
    {
      qFr: 'Quels sont les délais de livraison à Cotonou, Calavi et Porto-Novo ?',
      qEn: 'What are delivery times in Cotonou, Calavi, and Porto-Novo?',
      aFr: 'Livraison Express en 2h à Cotonou (Ganhi, Haie Vive, Cadjèhoun, Akpakpa) et en 4h à Abomey-Calavi & Porto-Novo.',
      aEn: '2-hour express delivery across Cotonou and 4-hour courier delivery to Abomey-Calavi and Porto-Novo.',
    },
    {
      qFr: 'Comment obtenir une facture normalisée DGI pour mon entreprise ?',
      qEn: 'How do I get an official DGI invoice for my business?',
      aFr: 'Chaque commande livrée génère automatiquement une facture certifiée MECeF / DGI Bénin consultable dans Mes Commandes.',
      aEn: 'Every completed order generates an official MECeF / DGI Benin invoice inside your Orders tab.',
    },
  ];

  // Signed-out Auth Flow (+229 + 4-digit SMS OTP Keypad)
  if (!user.signedIn) {
    return (
      <div className="mx-auto max-w-md space-y-6 pb-8">
        <div className="rounded-3xl bg-[#4F28E8] p-7 text-white">
          <p className="text-xs font-semibold text-indigo-200">MINI-B BÉNIN</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold">
            {authStep === 'phone'
              ? lang === 'fr'
                ? 'Bon retour !'
                : 'Welcome back!'
              : lang === 'fr'
              ? 'Code de confirmation'
              : 'Verification Code'}
          </h1>
          <p className="mt-1 text-sm text-indigo-100">
            {authStep === 'phone'
              ? lang === 'fr'
                ? 'Connectez-vous avec votre numéro MTN MoMo ou Moov'
                : 'Sign in with your Benin MTN or Moov number'
              : `+229 ${authPhone}`}
          </p>
        </div>

        {authStep === 'phone' ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700">
                {lang === 'fr' ? 'Numéro de téléphone (+229)' : 'Phone Number (+229)'}
              </label>
              <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <span className="px-3 font-mono text-xs font-bold text-[#4F28E8]">+229</span>
                <input
                  type="tel"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  className="h-12 flex-1 bg-transparent pr-3 font-mono text-sm font-semibold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAuthStep('otp')}
              className="min-h-[48px] w-full rounded-xl bg-[#4F28E8] text-sm font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
            >
              {lang === 'fr' ? 'Recevoir le code OTP par SMS' : 'Send SMS OTP Code'}
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5">
            <div className="grid grid-cols-4 gap-3">
              {otpDigits.map((d, i) => (
                <div
                  key={i}
                  className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 font-mono text-2xl font-extrabold text-[#4F28E8]"
                >
                  {d || '·'}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'BACK'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeypadTap(k)}
                  className="h-12 rounded-xl bg-slate-100 font-mono text-base font-bold text-slate-900 hover:bg-slate-200 active:scale-95 cursor-pointer"
                >
                  {k === 'BACK' ? '⌫' : k}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={otpDigits.some((d) => d === '')}
              onClick={() => {
                setAuthStep('phone');
                onToggleAuth(`+229 ${authPhone}`);
              }}
              className="min-h-[48px] w-full rounded-xl bg-[#4F28E8] text-sm font-bold text-white hover:bg-[#3F1CC9] disabled:opacity-50 cursor-pointer"
            >
              {lang === 'fr' ? 'Vérifier & Accéder à MINI-B' : 'Verify & Sign In'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-100 p-1">
          {(
            [
              { id: 'overview', fr: 'Profil', en: 'Profile' },
              { id: 'wallet', fr: 'Portefeuille', en: 'Wallet' },
              { id: 'addresses', fr: 'Adresses', en: 'Addresses' },
              { id: 'support', fr: 'Support & FAQ', en: 'Support' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeSection(item.id)}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                section === item.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {lang === 'fr' ? item.fr : item.en}
            </button>
          ))}
        </div>

        <PWAInstallButton lang={lang} variant="banner" />
      </div>

      {section === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* User Profile & Quick Cashback Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4F28E8] font-display text-xl font-extrabold text-white">
                  AT
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-700">
                    {lang === 'fr' ? 'Compte Vérifié · KYC VIP' : 'Verified Account · KYC VIP'}
                  </p>
                  <h1 className="font-display text-xl font-extrabold text-slate-900">{user.name}</h1>
                  <p className="text-xs text-slate-500">
                    {user.city} · {user.rating} ({user.deliveriesCount}{' '}
                    {lang === 'fr' ? 'livraisons' : 'deliveries'})
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#4F28E8] p-5 text-white">
                <p className="text-xs font-medium text-indigo-200">
                  {lang === 'fr' ? 'Solde Cashback MINI-B' : 'MINI-B Cashback Balance'}
                </p>
                <p className="mt-1 font-mono text-3xl font-extrabold tabular-nums">
                  {formatFCFA(walletBalance)}
                </p>
                <div className="mt-4 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(true)}
                    className="flex-1 min-h-[40px] rounded-xl bg-white px-3 text-xs font-bold text-[#4F28E8] hover:bg-indigo-50 cursor-pointer"
                  >
                    {lang === 'fr' ? 'Recharger MoMo' : 'Top Up MoMo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeSection('wallet')}
                    className="flex-1 min-h-[40px] rounded-xl bg-white/15 px-3 text-xs font-bold text-white hover:bg-white/25 cursor-pointer"
                  >
                    {lang === 'fr' ? 'Voir Portefeuille' : 'View Wallet'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Menu Rows */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onOpenOrders}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 text-left hover:border-[#4F28E8] cursor-pointer"
              >
                <div>
                  <Package className="h-5 w-5 text-[#4F28E8]" />
                  <p className="mt-2 font-display text-sm font-bold text-slate-900">
                    {lang === 'fr' ? 'Mes Commandes' : 'My Orders'}
                  </p>
                  <p className="font-mono text-xs text-slate-500 tabular-nums">{ordersCount}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={onOpenWishlist}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-5 text-left hover:border-[#4F28E8] cursor-pointer"
              >
                <div>
                  <UserCheck className="h-5 w-5 text-rose-500" />
                  <p className="mt-2 font-display text-sm font-bold text-slate-900">
                    {lang === 'fr' ? 'Favoris' : 'Wishlist'}
                  </p>
                  <p className="font-mono text-xs text-slate-500 tabular-nums">{wishlistCount}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white">
              <button
                type="button"
                onClick={() => onChangeSection('addresses')}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#4F28E8]" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {lang === 'fr' ? "Carnet d'Adresses Bénin" : 'Benin Address Book'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {addresses.length} {lang === 'fr' ? 'adresses avec repères' : 'saved addresses'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onChangeSection('wallet')}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {lang === 'fr' ? 'Moyens de Paiement MoMo' : 'Linked Mobile Money'}
                    </p>
                    <p className="text-xs text-slate-500">MTN MoMo ({user.phone})</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => onChangeSection('support')}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-slate-700" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {lang === 'fr' ? 'Support VIP MINI-B' : 'MINI-B VIP Concierge'}
                    </p>
                    <p className="text-xs text-slate-500">+229 97 00 00 00 · WhatsApp & FAQ</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onToggleAuth()}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>
                {lang === 'fr' ? 'Tester la déconnexion / Connexion OTP' : 'Sign Out / Test OTP Login'}
              </span>
            </button>
          </div>
        </div>
      )}

      {section === 'wallet' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-[#5B32F0] to-[#3416B8] p-6 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold">MINI-B PAY</span>
                <span className="text-xs font-medium text-indigo-200">Bénin / WAEMU</span>
              </div>
              <p className="mt-6 text-xs text-indigo-200">
                {lang === 'fr' ? 'SOLDE DISPONIBLE' : 'AVAILABLE BALANCE'}
              </p>
              <p className="mt-1 font-mono text-3xl font-extrabold tabular-nums">
                {formatFCFA(walletBalance)}
              </p>
              <div className="mt-6 flex items-center justify-between text-xs text-indigo-100">
                <span className="font-semibold uppercase">{user.name}</span>
                <span className="font-mono">•••• 8824</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-slate-900">
                {lang === 'fr' ? 'Comptes Mobile Money Liés' : 'Linked Mobile Money Accounts'}
              </h2>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">MTN Mobile Money</p>
                  <p className="font-mono text-xs text-slate-500">{user.phone}</p>
                </div>
                <span className="text-xs font-semibold text-[#4F28E8]">Principal</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-bold text-slate-900">Moov Flooz</p>
                  <p className="font-mono text-xs text-slate-500">+229 95 33 21 10</p>
                </div>
                <span className="text-xs font-medium text-slate-500">Secondaire</span>
              </div>
              <button
                type="button"
                onClick={() => setShowTopUpModal(true)}
                className="min-h-[42px] w-full rounded-xl bg-[#4F28E8] text-xs font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
              >
                {lang === 'fr' ? '+ Recharger via MoMo' : '+ Top Up via MoMo'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-slate-900">
                  {lang === 'fr' ? 'Dernières Transactions' : 'Recent Transactions'}
                </h2>
                <Wallet className="h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          tx.type === 'credit'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft className="h-4 w-4" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {lang === 'fr' ? tx.titleFr : tx.titleEn}
                        </p>
                        <p className="text-xs text-slate-500">
                          {lang === 'fr' ? tx.dateFr : tx.dateEn} · {tx.channel}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-sm font-bold tabular-nums shrink-0 ${
                        tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {formatFCFA(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {section === 'addresses' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-slate-900">
                {lang === 'fr' ? 'Adresses de Livraison' : 'Benin Delivery Addresses'}
              </h1>
              <p className="text-sm text-slate-500">
                {lang === 'fr'
                  ? 'Ajoutez un repère local précis (pharmacie, carrefour) pour une livraison sans appel.'
                  : 'Add a clear local landmark (pharmacy, junction) for seamless courier drop-off.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddressForm((s) => !s)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#4F28E8] px-4 py-2 text-xs font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{lang === 'fr' ? 'Nouvelle adresse' : 'Add Address'}</span>
            </button>
          </div>

          {showAddressForm && (
            <form
              onSubmit={handleSaveAddress}
              className="rounded-3xl border border-slate-200 bg-white p-6 space-y-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={lang === 'fr' ? 'Nom (ex: Bureau Fidjrossè)' : 'Label'}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm focus:border-[#4F28E8] focus:bg-white focus:outline-none"
                />
                <select
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold focus:border-[#4F28E8] focus:outline-none"
                >
                  <option value="Cotonou">Cotonou</option>
                  <option value="Abomey-Calavi">Abomey-Calavi</option>
                  <option value="Porto-Novo">Porto-Novo</option>
                  <option value="Ouidah">Ouidah</option>
                </select>
                <input
                  type="text"
                  required
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  placeholder={lang === 'fr' ? 'Quartier / Carré' : 'District'}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm focus:border-[#4F28E8] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  placeholder={
                    lang === 'fr'
                      ? 'Repère (ex: Face Pharmacie les 4 Théâtres)'
                      : 'Landmark (e.g. Opposite Pharmacy)'
                  }
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm focus:border-[#4F28E8] focus:bg-white focus:outline-none"
                />
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+229 97 00 11 22"
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 font-mono text-sm focus:border-[#4F28E8] focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="min-h-[40px] rounded-xl px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {lang === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-xl bg-[#4F28E8] px-5 text-xs font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
                >
                  {lang === 'fr' ? 'Enregistrer' : 'Save'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {addresses.map((addr) => (
              <article
                key={addr.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-5 ${
                  addr.isDefault ? 'border-[#4F28E8] ring-2 ring-[#4F28E8]/15' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-display text-base font-bold text-slate-900">
                        {addr.label}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {addr.district}, {addr.city}
                      </p>
                    </div>
                    {addr.isDefault && (
                      <span className="text-[11px] font-bold text-[#4F28E8]">
                        {lang === 'fr' ? 'Par défaut' : 'Default'}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                    <strong className="text-slate-900">
                      {lang === 'fr' ? 'Repère :' : 'Landmark:'}
                    </strong>{' '}
                    {addr.landmark}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  {!addr.isDefault ? (
                    <button
                      type="button"
                      onClick={() => onSetDefaultAddress(addr.id)}
                      className="text-xs font-bold text-[#4F28E8] hover:underline cursor-pointer"
                    >
                      {lang === 'fr' ? 'Définir par défaut' : 'Set as default'}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">{addr.phone}</span>
                  )}

                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(addr.id)}
                      aria-label="Supprimer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {section === 'support' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl bg-[#4F28E8] p-6 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-200">
                <ShieldCheck className="h-4 w-4" />
                <span>MINI-B CONCIERGE BÉNIN</span>
              </div>
              <h1 className="mt-2 font-display text-2xl font-extrabold">
                {lang === 'fr' ? 'Support & Assistance' : 'Support & Help Center'}
              </h1>
              <p className="mt-1 text-sm text-indigo-100">
                {lang === 'fr'
                  ? 'Temps d’attente moyen estimé : moins de 3 minutes.'
                  : 'Average response time: under 3 minutes.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3">
              <h2 className="font-display text-sm font-bold text-slate-900">
                Assistance Directe WhatsApp
              </h2>
              <p className="font-mono text-xs text-slate-500">+229 97 00 00 00</p>
              <a
                href="https://wa.me/22997000000"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                <span>
                  {lang === 'fr' ? 'Démarrer le chat WhatsApp' : 'Start WhatsApp Chat'}
                </span>
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm font-bold text-slate-900">
                  {lang === 'fr' ? 'Numéro Vert Bénin' : 'Toll-Free Hotline'}
                </h2>
                <span className="font-mono text-base font-extrabold text-[#4F28E8]">80 00 22 29</span>
              </div>
              <p className="text-xs text-slate-500">
                Appel gratuit MTN & Moov · Lun - Sam : 08h00 - 20h00
              </p>
              <a
                href="tel:+22980002229"
                className="mt-2 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:border-[#4F28E8] hover:text-[#4F28E8]"
              >
                <Phone className="h-4 w-4" />
                <span>{lang === 'fr' ? 'Appeler le support' : 'Call Support'}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {lang === 'fr' ? 'Agence Ganhi & Point Retrait Express' : 'Ganhi Pickup Hub'}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Rue du Commerce, en face Direction Générale des Impôts (DGI), Cotonou, Bénin.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-500">LUNDI - VENDREDI</p>
                  <p className="mt-0.5 font-mono font-bold text-slate-900">08:00 - 19:30</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-500">SAMEDI & FÉRIÉS</p>
                  <p className="mt-0.5 font-mono font-bold text-slate-900">09:00 - 17:00</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {lang === 'fr' ? 'Questions Fréquentes (Bénin)' : 'Frequently Asked Questions'}
              </h2>
              <div className="mt-4 divide-y divide-slate-100">
                {faqs.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 text-left text-sm font-bold text-slate-900 cursor-pointer"
                      >
                        <span>{lang === 'fr' ? item.qFr : item.qEn}</span>
                        <span className="font-mono text-base text-[#4F28E8]">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          {lang === 'fr' ? item.aFr : item.aEn}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MoMo & Crypto Top-Up Modal */}
      {showTopUpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {lang === 'fr' ? 'Recharger MINI-B Pay' : 'Top Up MINI-B Pay'}
              </h3>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
              {(['MTN MoMo', 'Crypto USDT (TRC20)'] as const).map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setTopUpChannel(ch)}
                  className={`min-h-[36px] rounded-lg px-2 text-xs font-bold transition-colors cursor-pointer ${
                    topUpChannel === ch ? 'bg-white text-[#4F28E8] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {ch === 'MTN MoMo' ? 'MTN MoMo' : 'Crypto (USDT)'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[10000, 25000, 50000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`min-h-[42px] rounded-xl border font-mono text-xs font-bold cursor-pointer ${
                    topUpAmount === amt
                      ? 'border-[#4F28E8] bg-[#4F28E8]/10 text-[#4F28E8]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {formatFCFA(amt)}
                </button>
              ))}
            </div>

            {topUpChannel === 'Crypto USDT (TRC20)' && (
              <div className="rounded-xl bg-[#F2EFFB] p-3 text-xs text-slate-700">
                <p className="font-semibold text-slate-900">
                  {lang === 'fr' ? 'Équivalent :' : 'Equivalent:'}{' '}
                  <span className="font-mono font-extrabold text-[#4F28E8] tabular-nums">
                    {(topUpAmount / 605).toFixed(2)} USDT
                  </span>{' '}
                  (TRC20)
                </p>
                <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
                  TY8xK9mN4pQr7vW2zL6cB5sF1jD3eH9aM2
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                onTopUpWallet(topUpAmount, topUpChannel);
                setShowTopUpModal(false);
              }}
              className="min-h-[46px] w-full rounded-xl bg-[#4F28E8] text-sm font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
            >
              {lang === 'fr'
                ? `Créditer ${formatFCFA(topUpAmount)}`
                : `Add ${formatFCFA(topUpAmount)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
