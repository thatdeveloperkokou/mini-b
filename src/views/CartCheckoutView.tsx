import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Tag,
  Trash2,
} from 'lucide-react';
import { formatFCFA } from '../data/storeData';
import { BeninAddress, CartItem, Language, Order, PaymentMethodId, Product } from '../types';
import { ProductImage } from '../components/ProductImage';

interface CartCheckoutViewProps {
  lang: Language;
  cart: CartItem[];
  products: Product[];
  addresses: BeninAddress[];
  onUpdateQty: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onBrowseCatalog: () => void;
  onOpenAddresses: () => void;
  onCompleteOrder: (order: Order) => void;
}

export const CartCheckoutView: React.FC<CartCheckoutViewProps> = ({
  lang,
  cart,
  products,
  addresses,
  onUpdateQty,
  onRemoveItem,
  onBrowseCatalog,
  onOpenAddresses,
  onCompleteOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [promoInput, setPromoInput] = useState('COTONOU2024');
  const [appliedPromo, setAppliedPromo] = useState<string>('COTONOU2024');
  const [promoFeedback, setPromoFeedback] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('mtn_momo');
  const [momoPhone, setMomoPhone] = useState('97 12 45 80');
  const [cryptoAsset, setCryptoAsset] = useState<'USDT' | 'USDC' | 'BTC' | 'ETH'>('USDT');
  const [cryptoNetwork, setCryptoNetwork] = useState<'TRC20' | 'Polygon' | 'Lightning' | 'Arbitrum'>('TRC20');
  const [txHash, setTxHash] = useState('');
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [processingUSSD, setProcessingUSSD] = useState(false);

  const cryptoAssets: {
    symbol: 'USDT' | 'USDC' | 'BTC' | 'ETH';
    network: 'TRC20' | 'Polygon' | 'Lightning' | 'Arbitrum';
    rateFcfa: number;
    decimals: number;
    address: string;
  }[] = [
    {
      symbol: 'USDT',
      network: 'TRC20',
      rateFcfa: 605,
      decimals: 2,
      address: 'TY8xK9mN4pQr7vW2zL6cB5sF1jD3eH9aM2',
    },
    {
      symbol: 'USDC',
      network: 'Polygon',
      rateFcfa: 605,
      decimals: 2,
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    },
    {
      symbol: 'BTC',
      network: 'Lightning',
      rateFcfa: 56500000,
      decimals: 6,
      address: 'bc1qminib8cotonou9express2hbenin7x4k2p',
    },
    {
      symbol: 'ETH',
      network: 'Arbitrum',
      rateFcfa: 1980000,
      decimals: 5,
      address: '0x9A67F1940164d0318612b497E8e6038f902a00a4',
    },
  ];

  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const resolvedItems = cart
    .map((item, idx) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const variant = product.variants?.find((v) => v.id === item.variantId);
      const unitPrice = product.price + (variant?.priceDelta ?? 0);
      return {
        idx,
        item,
        product,
        variant,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = resolvedItems.reduce((sum, x) => sum + x.lineTotal, 0);
  const deliveryFee = subtotal > 0 ? 1500 : 0;

  let discount = 0;
  if (appliedPromo === 'COTONOU2024' && subtotal >= 200000) {
    discount = 15000;
  } else if (appliedPromo === 'MINIB5' && subtotal > 0) {
    discount = Math.round(subtotal * 0.05);
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - discount);

  const selectedCrypto =
    cryptoAssets.find((a) => a.symbol === cryptoAsset) || cryptoAssets[0];
  const cryptoAmountStr = (grandTotal / selectedCrypto.rateFcfa).toFixed(
    selectedCrypto.decimals
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'COTONOU2024' || code === 'MINIB5') {
      setAppliedPromo(code);
      if (code === 'COTONOU2024' && subtotal < 200000) {
        setPromoFeedback(
          lang === 'fr'
            ? `Code COTONOU2024 enregistré · Valable dès 200.000 FCFA d'achat (-15.000 FCFA).`
            : `Code COTONOU2024 saved · Applies to orders over 200.000 FCFA (15.000 FCFA off).`
        );
      } else {
        setPromoFeedback(
          lang === 'fr' ? `Code ${code} appliqué avec succès.` : `Promo ${code} applied.`
        );
      }
    } else {
      setPromoFeedback(
        lang === 'fr'
          ? 'Code invalide. Essayez COTONOU2024 ou MINIB5.'
          : 'Invalid code. Try COTONOU2024 or MINIB5.'
      );
    }
  };

  const paymentOptions: {
    id: PaymentMethodId;
    title: string;
    subtitleFr: string;
    subtitleEn: string;
    tag?: string;
  }[] = [
    {
      id: 'mtn_momo',
      title: 'MTN Mobile Money',
      subtitleFr: 'Paiement instantané par push USSD (*880#)',
      subtitleEn: 'Instant USSD push validation (*880#)',
      tag: lang === 'fr' ? 'Populaire' : 'Popular',
    },
    {
      id: 'moov_flooz',
      title: 'Moov Money Flooz',
      subtitleFr: 'Paiement sécurisé Flooz (*155#)',
      subtitleEn: 'Secure Flooz payment (*155#)',
    },
    {
      id: 'celtiis_cash',
      title: 'Celtiis Cash',
      subtitleFr: 'Réseau GSM national Bénin (SBIN)',
      subtitleEn: 'National Benin network (SBIN)',
    },
    {
      id: 'wave',
      title: 'Wave Bénin',
      subtitleFr: 'Paiement QR ou numéro Wave sans frais',
      subtitleEn: 'Zero-fee Wave QR or mobile transfer',
      tag: '0% Frais',
    },
    {
      id: 'crypto',
      title: lang === 'fr' ? 'Paiement Crypto (USDT / USDC / BTC / ETH)' : 'Crypto Payment (USDT / USDC / BTC / ETH)',
      subtitleFr: 'USDT TRC20, USDC Polygon, Bitcoin Lightning & ETH · Conversion FCFA instantanée',
      subtitleEn: 'USDT TRC20, USDC Polygon, Bitcoin Lightning & ETH · Instant FCFA rate lock',
      tag: '0% Frais · Web3',
    },
    {
      id: 'card',
      title: 'Carte Bancaire (Visa / Mastercard)',
      subtitleFr: 'Débit / Crédit sécurisé 3D Secure UBA, BOA, Ecobank',
      subtitleEn: '3D Secure Visa & Mastercard',
    },
    {
      id: 'cod',
      title: lang === 'fr' ? 'Paiement à la Livraison' : 'Cash on Delivery',
      subtitleFr: 'Réglez en espèces à la réception de votre colis',
      subtitleEn: 'Pay in cash upon parcel inspection',
    },
  ];

  const handleConfirmPayment = () => {
    setProcessingUSSD(true);
    setTimeout(() => {
      const selectedMethod = paymentOptions.find((m) => m.id === paymentMethod);
      const otp = String(Math.floor(1000 + Math.random() * 9000));
      const newOrderId = `MB-${Math.floor(9825 + Math.random() * 150)}`;
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0'
      )}`;

      const newOrder: Order = {
        id: newOrderId,
        date: lang === 'fr' ? `Aujourd'hui · ${hhmm}` : `Today · ${hhmm}`,
        status: 'in_progress',
        items: resolvedItems.map((r) => ({
          productId: r.product.id,
          name: lang === 'fr' ? r.product.name : r.product.nameEn,
          image: r.product.image,
          quantity: r.item.quantity,
          unitPrice: r.unitPrice,
          variantLabel: [r.variant?.label, r.item.color].filter(Boolean).join(' · ') || undefined,
        })),
        total: grandTotal,
        discount,
        deliveryFee,
        paymentMethodLabel:
          paymentMethod === 'crypto'
            ? `Crypto (${cryptoAmountStr} ${selectedCrypto.symbol} · ${cryptoNetwork})`
            : selectedMethod?.title || 'MTN Mobile Money',
        addressSummary: `${defaultAddress.district}, ${defaultAddress.city}`,
        landmark: defaultAddress.landmark,
        otpCode: otp,
        etaMinutes: 25,
        courier: {
          name: 'Koffi Dossou',
          rating: '4.9',
          reviews: 420,
          vehicle: 'Bajaj Boxer',
          plate: 'AY 8492 RB',
          phone: '+229 97 44 11 22',
        },
        steps: [
          {
            id: 's1',
            titleFr: 'Commande confirmée',
            titleEn: 'Order confirmed',
            detailFr:
              paymentMethod === 'crypto'
                ? `Transaction ${cryptoAmountStr} ${selectedCrypto.symbol} (${cryptoNetwork}) confirmée`
                : `Paiement via ${selectedMethod?.title} validé`,
            detailEn:
              paymentMethod === 'crypto'
                ? `${cryptoAmountStr} ${selectedCrypto.symbol} (${cryptoNetwork}) on-chain transfer verified`
                : `Payment via ${selectedMethod?.title} verified`,
            time: hhmm,
            completed: true,
          },
          {
            id: 's2',
            titleFr: 'Colis préparé & vérifié',
            titleEn: 'Parcel packed & sealed',
            detailFr: 'Hub logistique Ganhi — Préparation express',
            detailEn: 'Ganhi logistics hub — Express dispatch',
            time: hhmm,
            completed: false,
            active: true,
          },
          {
            id: 's3',
            titleFr: "En cours d'acheminement",
            titleEn: 'Out for delivery',
            detailFr: `En route vers ${defaultAddress.district}`,
            detailEn: `Heading to ${defaultAddress.district}`,
            time: '--:--',
            completed: false,
          },
          {
            id: 's4',
            titleFr: 'Livré & Code OTP validé',
            titleEn: 'Delivered & OTP confirmed',
            detailFr: 'Remise en main propre contre code secret',
            detailEn: 'Handover confirmed with 4-digit OTP',
            time: '--:--',
            completed: false,
          },
        ],
      };

      setProcessingUSSD(false);
      onCompleteOrder(newOrder);
    }, 1100);
  };

  if (resolvedItems.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
        <h1 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
          {lang === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {lang === 'fr'
            ? 'Ajoutez des articles pour profiter de la livraison 2h à Cotonou.'
            : 'Add items to enjoy 2-hour express delivery in Cotonou.'}
        </p>
        <button
          type="button"
          onClick={onBrowseCatalog}
          className="mt-6 inline-flex min-h-[46px] items-center rounded-xl bg-[#4F28E8] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
        >
          {lang === 'fr' ? 'Parcourir la boutique' : 'Browse Store'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {step === 'checkout' && (
            <button
              type="button"
              onClick={() => setStep('cart')}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#4F28E8] cursor-pointer"
              aria-label="Retour au panier"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {step === 'cart'
                ? lang === 'fr'
                  ? 'Mon Panier'
                  : 'Shopping Cart'
                : lang === 'fr'
                ? 'Paiement Sécurisé'
                : 'Secure Checkout'}
            </h1>
            <p className="text-xs text-slate-500">
              {step === 'cart'
                ? `${resolvedItems.reduce((s, r) => s + r.item.quantity, 0)} ${
                    lang === 'fr' ? 'articles sélectionnés' : 'items selected'
                  }`
                : lang === 'fr'
                ? 'Étape 2 sur 2 · Choisissez votre mode de paiement adapté au Bénin'
                : 'Step 2 of 2 · Choose your local Benin payment method'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Main Content */}
        <div className="space-y-4 lg:col-span-7">
          {/* Delivery Address Summary */}
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4F28E8]/10 text-[#4F28E8]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {lang === 'fr' ? 'Adresse de livraison validée' : 'Delivery address'}
                </p>
                <p className="mt-0.5 font-display text-sm font-bold text-slate-900">
                  {defaultAddress.label} · {defaultAddress.district}, {defaultAddress.city}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">
                  {lang === 'fr' ? 'Repère :' : 'Landmark:'} {defaultAddress.landmark}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenAddresses}
              className="text-xs font-bold text-[#4F28E8] hover:underline shrink-0 cursor-pointer"
            >
              {lang === 'fr' ? 'Modifier' : 'Change'}
            </button>
          </div>

          {step === 'cart' ? (
            <>
              {/* Cart Items */}
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white">
                {resolvedItems.map(({ idx, item, product, variant, unitPrice }) => {
                  const title = lang === 'fr' ? product.name : product.nameEn;
                  return (
                    <div key={`${product.id}-${idx}`} className="flex gap-4 p-4 sm:p-5">
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <ProductImage src={product.image} alt={title} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="font-display text-sm font-bold text-slate-900 truncate">
                              {title}
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                              {[variant?.label, item.color].filter(Boolean).join(' · ') ||
                                product.district}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(idx)}
                            aria-label="Retirer"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-4">
                          <p className="font-mono text-sm font-extrabold text-[#4F28E8] tabular-nums">
                            {formatFCFA(unitPrice * item.quantity)}
                          </p>
                          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(idx, -1)}
                              aria-label="Diminuer"
                              className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center font-mono text-xs font-bold text-slate-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(idx, 1)}
                              aria-label="Augmenter"
                              className="flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code */}
              <form
                onSubmit={handleApplyPromo}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <Tag className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="COTONOU2024"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 pl-10 font-mono text-xs font-semibold uppercase text-slate-900 focus:border-[#4F28E8] focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="min-h-[44px] rounded-xl bg-slate-900 px-5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                >
                  {lang === 'fr' ? 'Appliquer' : 'Apply Code'}
                </button>
              </form>
              {promoFeedback && <p className="px-1 text-xs font-medium text-emerald-700">{promoFeedback}</p>}
            </>
          ) : (
            /* Payment Methods Selection */
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-display text-base font-bold text-slate-900">
                  {lang === 'fr' ? 'Mode de paiement' : 'Payment Method'}
                </h2>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <Lock className="h-3.5 w-3.5" />
                  SSL 256-bit
                </span>
              </div>

              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                const isMobileMoney =
                  opt.id === 'mtn_momo' || opt.id === 'moov_flooz' || opt.id === 'celtiis_cash';
                return (
                  <div
                    key={opt.id}
                    className={`rounded-2xl border bg-white p-4 transition-all ${
                      isSelected
                        ? 'border-[#4F28E8] ring-2 ring-[#4F28E8]/15'
                        : 'border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className="flex w-full items-center justify-between gap-3 text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-xs font-extrabold ${
                            opt.id === 'mtn_momo'
                              ? 'bg-amber-100 text-amber-900'
                              : opt.id === 'moov_flooz'
                              ? 'bg-sky-100 text-sky-900'
                              : opt.id === 'wave'
                              ? 'bg-cyan-100 text-cyan-900'
                              : opt.id === 'crypto'
                              ? 'bg-[#4F28E8]/12 text-[#4F28E8]'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {opt.id === 'card' ? (
                            <CreditCard className="h-4 w-4" />
                          ) : opt.id === 'crypto' ? (
                            <Coins className="h-4 w-4" />
                          ) : (
                            <Smartphone className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-bold text-slate-900">
                              {opt.title}
                            </span>
                            {opt.tag && (
                              <span className="text-[11px] font-semibold text-emerald-700">
                                · {opt.tag}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {lang === 'fr' ? opt.subtitleFr : opt.subtitleEn}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? 'border-[#4F28E8] bg-[#4F28E8] text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                    </button>

                    {isSelected && opt.id === 'crypto' && (
                      <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {cryptoAssets.map((asset) => {
                            const active = asset.symbol === cryptoAsset;
                            return (
                              <button
                                key={asset.symbol}
                                type="button"
                                onClick={() => {
                                  setCryptoAsset(asset.symbol);
                                  setCryptoNetwork(asset.network);
                                  setCopiedAddr(false);
                                }}
                                className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-colors cursor-pointer ${
                                  active
                                    ? 'border-[#4F28E8] bg-[#F2EFFB] text-[#4F28E8]'
                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                                }`}
                              >
                                <span className="font-display text-xs font-extrabold">
                                  {asset.symbol}
                                </span>
                                <span className="text-[10px] text-slate-500">{asset.network}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="flex flex-col gap-4 rounded-2xl bg-[#F8F7FC] p-4 sm:flex-row sm:items-center">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-[#EAE8F5] bg-white text-[#4F28E8]">
                            <QrCode className="h-12 w-12" />
                          </div>
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-500">
                                {lang === 'fr' ? 'Montant exact à envoyer :' : 'Exact amount due:'}
                              </span>
                              <span className="font-mono text-base font-extrabold text-[#4F28E8] tabular-nums">
                                {cryptoAmountStr} {selectedCrypto.symbol}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {lang === 'fr' ? 'Réseau :' : 'Network:'}{' '}
                              <strong className="text-slate-800">{selectedCrypto.network}</strong> ·{' '}
                              {lang === 'fr' ? 'Taux garanti 15 min' : 'Rate locked for 15 min'}
                            </p>
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                              <span className="flex-1 truncate font-mono text-[11px] text-slate-700">
                                {selectedCrypto.address}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(selectedCrypto.address);
                                  setCopiedAddr(true);
                                  setTimeout(() => setCopiedAddr(false), 2000);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg bg-[#F2EFFB] px-2.5 py-1 text-[11px] font-bold text-[#4F28E8] hover:bg-[#E7E2FA] cursor-pointer shrink-0"
                              >
                                {copiedAddr ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    <span>{lang === 'fr' ? 'Copié' : 'Copied'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3" />
                                    <span>{lang === 'fr' ? 'Copier' : 'Copy'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700">
                            {lang === 'fr'
                              ? 'Hash de transaction / ID Wallet (optionnel)'
                              : 'Transaction Hash / Sender Wallet (optional)'}
                          </label>
                          <input
                            type="text"
                            value={txHash}
                            onChange={(e) => setTxHash(e.target.value)}
                            placeholder="0x... / tronscan txid"
                            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-xs text-slate-900 focus:border-[#4F28E8] focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {isSelected && isMobileMoney && (
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <label className="block text-xs font-semibold text-slate-700">
                          {lang === 'fr'
                            ? `Numéro ${opt.title} (+229)`
                            : `${opt.title} Phone (+229)`}
                        </label>
                        <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          <span className="px-3 font-mono text-xs font-bold text-[#4F28E8]">
                            +229
                          </span>
                          <input
                            type="tel"
                            value={momoPhone}
                            onChange={(e) => setMomoPhone(e.target.value)}
                            className="h-11 flex-1 bg-transparent pr-3 font-mono text-sm font-semibold text-slate-900 focus:outline-none"
                          />
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {lang === 'fr'
                            ? 'Le prompt de validation USSD apparaîtra sur votre téléphone.'
                            : 'A USSD confirmation prompt will be sent to your handset.'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sticky Order Summary */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-20 rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5">
            <h2 className="font-display text-lg font-bold text-slate-900">
              {lang === 'fr' ? 'Récapitulatif de Commande' : 'Order Summary'}
            </h2>

            <dl className="space-y-3 border-b border-slate-100 pb-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">{lang === 'fr' ? 'Sous-total' : 'Subtotal'}</dt>
                <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                  {formatFCFA(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">
                  {lang === 'fr' ? 'Livraison Moto-Express' : 'Moto-Express Delivery'}
                </dt>
                <dd className="font-mono font-semibold text-slate-900 tabular-nums">
                  {formatFCFA(deliveryFee)}
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>
                    {lang === 'fr'
                      ? `Réduction (${appliedPromo})`
                      : `Discount (${appliedPromo})`}
                  </dt>
                  <dd className="font-mono font-bold tabular-nums">-{formatFCFA(discount)}</dd>
                </div>
              )}
            </dl>

            <div className="flex items-baseline justify-between">
              <div>
                <p className="font-display text-base font-bold text-slate-900">
                  {lang === 'fr' ? 'Total à Payer' : 'Total Due'}
                </p>
                <p className="text-xs text-slate-500">
                  {lang === 'fr' ? 'TVA & Facture DGI incluses' : 'Taxes & DGI receipt included'}
                </p>
              </div>
              <p className="font-mono text-2xl font-extrabold text-[#4F28E8] tabular-nums">
                {formatFCFA(grandTotal)}
              </p>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#4F28E8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3F1CC9] cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {lang === 'fr'
                    ? `Passer la Commande (${formatFCFA(grandTotal)})`
                    : `Checkout (${formatFCFA(grandTotal)})`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={processingUSSD}
                onClick={handleConfirmPayment}
                className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#4F28E8] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3F1CC9] disabled:opacity-70 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {processingUSSD
                    ? lang === 'fr'
                      ? 'Validation en cours...'
                      : 'Confirming payment...'
                    : lang === 'fr'
                    ? `Confirmer et Payer ${formatFCFA(grandTotal)}`
                    : `Confirm & Pay ${formatFCFA(grandTotal)}`}
                </span>
              </button>
            )}

            <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {lang === 'fr'
                  ? 'Garantie Protection Acheteur MINI-B · Cashback 3% crédité après livraison.'
                  : 'MINI-B Buyer Protection · 3% cashback credited after delivery.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
