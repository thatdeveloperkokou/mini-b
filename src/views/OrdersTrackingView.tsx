import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { formatFCFA } from '../data/storeData';
import { Language, Order } from '../types';
import { ProductImage } from '../components/ProductImage';

interface OrdersTrackingViewProps {
  lang: Language;
  mode: 'orders' | 'tracking';
  orders: Order[];
  activeTrackingOrderId: string;
  onSelectTrackingOrder: (orderId: string) => void;
  onBackToOrders: () => void;
  onConfirmDeliveryOtp: (orderId: string) => void;
  onReorder: (order: Order) => void;
}

export const OrdersTrackingView: React.FC<OrdersTrackingViewProps> = ({
  lang,
  mode,
  orders,
  activeTrackingOrderId,
  onSelectTrackingOrder,
  onBackToOrders,
  onConfirmDeliveryOtp,
  onReorder,
}) => {
  const [tab, setTab] = useState<'in_progress' | 'delivered' | 'cancelled'>('in_progress');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');

  const trackedOrder = orders.find((o) => o.id === activeTrackingOrderId) || orders[0];

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackedOrder) return;
    if (otpInput.trim() === trackedOrder.otpCode) {
      setOtpError('');
      setOtpInput('');
      onConfirmDeliveryOtp(trackedOrder.id);
    } else {
      setOtpError(
        lang === 'fr'
          ? `Code incorrect. Saisissez ${trackedOrder.otpCode} pour confirmer la remise.`
          : `Incorrect code. Enter ${trackedOrder.otpCode} to confirm handover.`
      );
    }
  };

  if (mode === 'tracking' && trackedOrder) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToOrders}
            className="inline-flex min-h-[40px] items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#4F28E8] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{lang === 'fr' ? 'Mes Commandes' : 'My Orders'}</span>
          </button>

          <span className="font-mono text-sm font-bold text-slate-900">#{trackedOrder.id}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Interactive Cotonou Route Map Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
              <div className="relative h-64 w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-emerald-50 p-5">
                {/* Clean Schematic Cotonou Coastline & Route SVG */}
                <svg
                  viewBox="0 0 600 260"
                  className="h-full w-full"
                  aria-label="Carte itinéraire livraison Cotonou"
                >
                  {/* Lagoon / Ocean tint */}
                  <path
                    d="M0 215 Q160 190 320 205 T600 195 L600 260 L0 260 Z"
                    fill="#BAE6FD"
                    opacity="0.55"
                  />
                  {/* Roads */}
                  <path
                    d="M40 165 L560 120"
                    stroke="#E2E8F0"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M120 40 L210 210"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Active Express Route */}
                  <path
                    d="M125 165 C 210 140, 310 135, 465 92"
                    fill="none"
                    stroke="#4F28E8"
                    strokeWidth="5"
                    strokeDasharray="10 8"
                    strokeLinecap="round"
                  />
                  {/* Ganhi Hub Node */}
                  <circle cx="125" cy="165" r="10" fill="#0F172A" />
                  <text x="88" y="192" className="fill-slate-700 text-[12px] font-bold">
                    Hub Ganhi
                  </text>
                  {/* Courier Moto Marker */}
                  <circle cx="315" cy="132" r="18" fill="#4F28E8" />
                  <circle cx="315" cy="132" r="24" fill="#4F28E8" opacity="0.2" />
                  <text
                    x="315"
                    y="136"
                    textAnchor="middle"
                    className="fill-white text-[11px] font-bold"
                  >
                    MOTO
                  </text>
                  {/* Destination Node */}
                  <circle cx="465" cy="92" r="11" fill="#10B981" />
                  <text x="435" y="72" className="fill-slate-900 text-[12px] font-bold">
                    {lang === 'fr' ? 'Vous (Haie Vive)' : 'You (Haie Vive)'}
                  </text>
                </svg>

                <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between rounded-2xl bg-slate-900/90 px-4 py-3 text-white backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                      <Navigation className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-slate-300">
                        {lang === 'fr' ? 'ARRIVÉE ESTIMÉE' : 'ESTIMATED ARRIVAL'}
                      </p>
                      <p className="font-mono text-base font-extrabold tabular-nums">
                        {trackedOrder.status === 'delivered'
                          ? lang === 'fr'
                            ? 'Colis livré'
                            : 'Delivered'
                          : `${trackedOrder.etaMinutes} min · En route`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300">
                    Bd de la Marina
                  </span>
                </div>
              </div>

              {/* Courier Card */}
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F28E8]/10 font-display text-sm font-extrabold text-[#4F28E8]">
                      {trackedOrder.courier.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-slate-900">
                        {trackedOrder.courier.name}
                      </h2>
                      <p className="text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {trackedOrder.courier.rating} ({trackedOrder.courier.reviews})
                        </span>{' '}
                        · {trackedOrder.courier.vehicle} ·{' '}
                        <span className="font-mono">{trackedOrder.courier.plate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${trackedOrder.courier.phone}`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 hover:border-[#4F28E8] hover:text-[#4F28E8]"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>{lang === 'fr' ? 'Appeler' : 'Call'}</span>
                    </a>
                    <a
                      href={`https://wa.me/22997000000`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs">
                  <MapPin className="h-4 w-4 text-[#4F28E8] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">{trackedOrder.addressSummary}</p>
                    <p className="mt-0.5 text-slate-600">
                      {lang === 'fr' ? 'Repère :' : 'Landmark:'} {trackedOrder.landmark}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Confidential OTP & Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* 4-Digit Handover OTP Card */}
            <div className="rounded-3xl border border-[#4F28E8]/20 bg-indigo-50/70 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-[#4F28E8]" />
                  <span>
                    {lang === 'fr' ? 'Code de Sécurité de Remise' : 'Handover Security Code'}
                  </span>
                </div>
                <Lock className="h-4 w-4 text-slate-400" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {trackedOrder.otpCode.split('').map((digit, i) => (
                  <div
                    key={i}
                    className="flex h-14 items-center justify-center rounded-2xl border border-indigo-200 bg-white font-mono text-2xl font-extrabold text-[#4F28E8] shadow-xs"
                  >
                    {digit}
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-slate-700">
                {lang === 'fr'
                  ? 'Communiquez ce code au livreur UNIQUEMENT après inspection de votre colis.'
                  : 'Share this code with your courier ONLY after inspecting your parcel.'}
              </p>

              {trackedOrder.status === 'in_progress' && (
                <form onSubmit={handleVerifyOtp} className="space-y-2 border-t border-indigo-200/70 pt-4">
                  <label className="block text-xs font-semibold text-slate-700">
                    {lang === 'fr'
                      ? 'Simuler la validation à la remise :'
                      : 'Simulate handover confirmation:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder={trackedOrder.otpCode}
                      className="h-10 w-28 rounded-xl border border-indigo-200 bg-white px-3 text-center font-mono text-sm font-bold tracking-widest text-slate-900 focus:border-[#4F28E8] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="flex-1 min-h-[40px] rounded-xl bg-[#4F28E8] px-4 text-xs font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
                    >
                      {lang === 'fr' ? 'Valider Remise' : 'Confirm Handover'}
                    </button>
                  </div>
                  {otpError && <p className="text-xs font-medium text-rose-600">{otpError}</p>}
                </form>
              )}
            </div>

            {/* Progression Timeline */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6">
              <h2 className="font-display text-base font-bold text-slate-900">
                {lang === 'fr' ? "Progression de l'acheminement" : 'Delivery Timeline'}
              </h2>
              <div className="mt-5 space-y-5">
                {trackedOrder.steps.map((s) => (
                  <div key={s.id} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          s.completed
                            ? 'bg-emerald-600 text-white'
                            : s.active
                            ? 'bg-[#4F28E8] text-white'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p
                          className={`text-sm font-bold ${
                            s.active ? 'text-[#4F28E8]' : 'text-slate-900'
                          }`}
                        >
                          {lang === 'fr' ? s.titleFr : s.titleEn}
                        </p>
                        <p className="text-xs text-slate-500">
                          {lang === 'fr' ? s.detailFr : s.detailEn}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => o.status === tab);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          {lang === 'fr' ? 'Mes Commandes' : 'My Orders'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {lang === 'fr'
            ? 'Historique, factures normalisées DGI et suivi temps réel'
            : 'Order history, DGI invoices, and live Cotonou tracking'}
        </p>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="inline-flex rounded-xl bg-slate-100 p-1">
        {(
          [
            { id: 'in_progress', fr: 'En cours', en: 'Active' },
            { id: 'delivered', fr: 'Livrées', en: 'Delivered' },
            { id: 'cancelled', fr: 'Annulées', en: 'Cancelled' },
          ] as const
        ).map((t) => {
          const count = orders.filter((o) => o.status === t.id).length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-[38px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                tab === t.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {lang === 'fr' ? t.fr : t.en} ({count})
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            {lang === 'fr'
              ? 'Aucune commande dans cette catégorie.'
              : 'No orders in this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono text-sm font-extrabold text-slate-900">
                    #{order.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{order.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{order.paymentMethodLabel}</span>
                </div>
                <span
                  className={`text-xs font-bold ${
                    order.status === 'in_progress' ? 'text-[#4F28E8]' : 'text-emerald-700'
                  }`}
                >
                  {order.status === 'in_progress'
                    ? lang === 'fr'
                      ? 'En acheminement'
                      : 'In Transit'
                    : lang === 'fr'
                    ? 'Livrée avec succès'
                    : 'Delivered'}
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div
                        key={idx}
                        className="h-14 w-16 overflow-hidden rounded-xl border-2 border-white bg-slate-100 shadow-xs"
                      >
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold text-slate-900 line-clamp-1">
                      {order.items.map((i) => i.name).join(' + ')}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">{order.addressSummary}</p>
                    <p className="mt-1 font-mono text-base font-extrabold text-[#4F28E8] tabular-nums">
                      {formatFCFA(order.total)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {order.status === 'in_progress' ? (
                    <button
                      type="button"
                      onClick={() => onSelectTrackingOrder(order.id)}
                      className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#4F28E8] px-4 py-2 text-xs font-bold text-white hover:bg-[#3F1CC9] cursor-pointer"
                    >
                      <Truck className="h-4 w-4" />
                      <span>{lang === 'fr' ? 'Suivre en direct' : 'Track Live'}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(order)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 hover:border-[#4F28E8] hover:text-[#4F28E8] cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>{lang === 'fr' ? 'Facture DGI' : 'DGI Invoice'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onReorder(order)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-[#4F28E8] cursor-pointer"
                      >
                        <span>{lang === 'fr' ? 'Acheter à nouveau' : 'Buy Again'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Normalized DGI Invoice Modal */}
      {invoiceOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#4F28E8]">RÉPUBLIQUE DU BÉNIN · MECeF / DGI</p>
                <h3 className="mt-1 font-display text-lg font-extrabold text-slate-900">
                  Facture Normalisée #{invoiceOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
              <p>
                <strong className="text-slate-900">Date :</strong> {invoiceOrder.date}
              </p>
              <p>
                <strong className="text-slate-900">Règlement :</strong>{' '}
                {invoiceOrder.paymentMethodLabel}
              </p>
              <p>
                <strong className="text-slate-900">Destination :</strong>{' '}
                {invoiceOrder.addressSummary}
              </p>
              <p className="font-mono text-[11px] text-slate-500">
                NIM: BJ01004928-MECEF · Code: 84F2-A91C-7B20
              </p>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              {invoiceOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between gap-3 py-2.5">
                  <span className="text-slate-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums shrink-0">
                    {formatFCFA(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between pt-3 font-bold text-slate-900">
                <span>Total TTC</span>
                <span className="font-mono text-base text-[#4F28E8] tabular-nums">
                  {formatFCFA(invoiceOrder.total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInvoiceOrder(null)}
              className="w-full min-h-[44px] rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 cursor-pointer"
            >
              {lang === 'fr' ? 'Fermer la facture' : 'Close Invoice'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
