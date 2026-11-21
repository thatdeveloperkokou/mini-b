import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  PRODUCTS,
  VENDORS,
} from './data/storeData';
import {
  AccountSection,
  AppView,
  BeninAddress,
  CartItem,
  CategoryId,
  Language,
  Order,
  Product,
  Review,
  UserProfile,
  WalletTransaction,
} from './types';
import { StoreHeader } from './components/StoreHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfflineIndicator } from './components/OfflineIndicator';
import { HomeView } from './views/HomeView';
import { CategoriesView } from './views/CategoriesView';
import { ProductDetailView } from './views/ProductDetailView';
import { VendorView } from './views/VendorView';
import { WishlistView } from './views/WishlistView';
import { CartCheckoutView } from './views/CartCheckoutView';
import { OrdersTrackingView } from './views/OrdersTrackingView';
import { AccountWalletView } from './views/AccountWalletView';

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadState('minib_lang', 'fr'));
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [accountSection, setAccountSection] = useState<AccountSection>('overview');

  const [products, setProducts] = useState<Product[]>(() => loadState('minib_products', PRODUCTS));
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProductId, setActiveProductId] = useState<string>(PRODUCTS[0].id);
  const [activeVendorId, setActiveVendorId] = useState<string>('benin_hightech');

  const [cart, setCart] = useState<CartItem[]>(() =>
    loadState('minib_cart', [
      { productId: 'dell-xps-13', variantId: '512gb', color: 'Gris Sidéral', quantity: 1 },
      { productId: 'sac-antichoc-pro', variantId: '15-inch', color: 'Noir Mat', quantity: 1 },
    ])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadState('minib_wishlist', ['dell-xps-13', 'pagne-wax-vlisco', 'montre-sport-cardio'])
  );

  const [user, setUser] = useState<UserProfile>(() => loadState('minib_user', INITIAL_USER));
  const [walletBalance, setWalletBalance] = useState<number>(() =>
    loadState('minib_wallet_balance', 38500)
  );
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() =>
    loadState('minib_transactions', INITIAL_TRANSACTIONS)
  );
  const [addresses, setAddresses] = useState<BeninAddress[]>(() =>
    loadState('minib_addresses', INITIAL_ADDRESSES)
  );
  const [orders, setOrders] = useState<Order[]>(() => loadState('minib_orders', INITIAL_ORDERS));
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>(INITIAL_ORDERS[0].id);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('minib_lang', JSON.stringify(lang));
  }, [lang]);
  useEffect(() => {
    localStorage.setItem('minib_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('minib_cart', JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem('minib_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem('minib_user', JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem('minib_wallet_balance', JSON.stringify(walletBalance));
  }, [walletBalance]);
  useEffect(() => {
    localStorage.setItem('minib_transactions', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('minib_addresses', JSON.stringify(addresses));
  }, [addresses]);
  useEffect(() => {
    localStorage.setItem('minib_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast((curr) => (curr === msg ? null : curr)), 2600);
  };

  const navigate = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const activeInProgressOrder = orders.find((o) => o.status === 'in_progress');

  const handleAddToCart = (
    product: Product,
    quantity = 1,
    variantId?: string,
    color?: string
  ) => {
    const resolvedVariant = variantId || product.variants?.[0]?.id;
    const resolvedColor = color || product.colors?.[0];
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (c) =>
          c.productId === product.id &&
          c.variantId === resolvedVariant &&
          c.color === resolvedColor
      );
      if (existingIdx >= 0) {
        return prev.map((c, idx) =>
          idx === existingIdx ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [
        ...prev,
        { productId: product.id, variantId: resolvedVariant, color: resolvedColor, quantity },
      ];
    });
    showToast(
      lang === 'fr'
        ? `${product.name} ajouté au panier`
        : `${product.nameEn} added to cart`
    );
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, idx) =>
          idx === index ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCompleteOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setActiveTrackingOrderId(newOrder.id);
    const cashback = Math.round(newOrder.total * 0.03);
    setWalletBalance((b) => b + cashback);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        titleFr: `Cashback Commande #${newOrder.id}`,
        titleEn: `Order #${newOrder.id} Cashback`,
        dateFr: "À l'instant",
        dateEn: 'Just now',
        channel: newOrder.paymentMethodLabel,
        amount: cashback,
        type: 'credit',
      },
      ...prev,
    ]);
    showToast(
      lang === 'fr'
        ? `Commande #${newOrder.id} confirmée · Suivi activé`
        : `Order #${newOrder.id} confirmed · Live tracking active`
    );
    navigate('tracking');
  };

  const handleConfirmDeliveryOtp = (orderId: string) => {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0'
    )}`;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'delivered',
              etaMinutes: 0,
              steps: o.steps.map((s) => ({
                ...s,
                completed: true,
                active: false,
                time: s.time === '--:--' ? hhmm : s.time,
              })),
            }
          : o
      )
    );
    showToast(
      lang === 'fr'
        ? `Colis #${orderId} remis et validé par OTP !`
        : `Parcel #${orderId} confirmed by OTP!`
    );
  };

  const handleAddReview = (productId: string, review: Review) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              reviewCount: p.reviewCount + 1,
              reviews: [review, ...p.reviews],
            }
          : p
      )
    );
    showToast(lang === 'fr' ? 'Merci pour votre avis !' : 'Thank you for your review!');
  };

  const handleTopUpWallet = (amount: number, channel: string) => {
    setWalletBalance((b) => b + amount);
    setTransactions((prev) => [
      {
        id: `tx-${Date.now()}`,
        titleFr: 'Recharge Portefeuille MINI-B',
        titleEn: 'MINI-B Wallet Top-Up',
        dateFr: "À l'instant",
        dateEn: 'Just now',
        channel,
        amount,
        type: 'credit',
      },
      ...prev,
    ]);
    showToast(
      lang === 'fr' ? 'Portefeuille rechargé avec succès !' : 'Wallet topped up successfully!'
    );
  };

  const handleAddAddress = (addr: Omit<BeninAddress, 'id'>) => {
    setAddresses((prev) => [...prev, { ...addr, id: `addr-${Date.now()}` }]);
    showToast(lang === 'fr' ? 'Adresse ajoutée au carnet.' : 'Address added.');
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    showToast(lang === 'fr' ? 'Adresse par défaut mise à jour.' : 'Default address updated.');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== id);
      if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
  };

  const activeProduct = products.find((p) => p.id === activeProductId) || products[0];
  const activeVendor = VENDORS[activeVendorId] || VENDORS.benin_hightech;

  return (
    <div className="min-h-screen bg-[#F8F7FC] text-slate-900 flex flex-col">
      <StoreHeader
        currentView={currentView}
        cartCount={cartCount}
        lang={lang}
        onNavigate={(v) => {
          if (v === 'account') setAccountSection('overview');
          navigate(v);
        }}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-20 sm:px-6 md:pb-12 lg:px-8">
        {currentView === 'home' && (
          <HomeView
            lang={lang}
            onChangeLang={setLang}
            products={products}
            wishlist={wishlist}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            defaultAddress={defaultAddress}
            activeOrderId={activeInProgressOrder?.id}
            onSelectCategory={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onToggleWishlist={handleToggleWishlist}
            onOpenProduct={(id) => {
              setActiveProductId(id);
              navigate('product');
            }}
            onQuickAdd={(p) => handleAddToCart(p, 1)}
            onOpenCategories={() => navigate('categories')}
            onOpenAddresses={() => {
              setAccountSection('addresses');
              navigate('account');
            }}
            onOpenVendor={(vid) => {
              setActiveVendorId(vid);
              navigate('vendor');
            }}
            onTrackOrder={(oid) => {
              setActiveTrackingOrderId(oid);
              navigate('tracking');
            }}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesView
            lang={lang}
            products={products}
            wishlist={wishlist}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectCategory={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onToggleWishlist={handleToggleWishlist}
            onOpenProduct={(id) => {
              setActiveProductId(id);
              navigate('product');
            }}
            onQuickAdd={(p) => handleAddToCart(p, 1)}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailView
            lang={lang}
            product={activeProduct}
            isWishlisted={wishlist.includes(activeProduct.id)}
            onBack={() => navigate('home')}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onBuyNow={(p, q, v, c) => {
              handleAddToCart(p, q, v, c);
              navigate('cart');
            }}
            onOpenVendor={(vid) => {
              setActiveVendorId(vid);
              navigate('vendor');
            }}
            onAddReview={handleAddReview}
          />
        )}

        {currentView === 'vendor' && (
          <VendorView
            lang={lang}
            vendor={activeVendor}
            products={products}
            wishlist={wishlist}
            onBack={() => navigate('home')}
            onToggleWishlist={handleToggleWishlist}
            onOpenProduct={(id) => {
              setActiveProductId(id);
              navigate('product');
            }}
            onQuickAdd={(p) => handleAddToCart(p, 1)}
            onOpenSupport={() => {
              setAccountSection('support');
              navigate('account');
            }}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            lang={lang}
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onOpenProduct={(id) => {
              setActiveProductId(id);
              navigate('product');
            }}
            onQuickAdd={(p) => handleAddToCart(p, 1)}
            onAddAllToCart={(items) => {
              items.forEach((p) => handleAddToCart(p, 1));
              navigate('cart');
            }}
            onBrowseCatalog={() => navigate('categories')}
          />
        )}

        {currentView === 'cart' && (
          <CartCheckoutView
            lang={lang}
            cart={cart}
            products={products}
            addresses={addresses}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onBrowseCatalog={() => navigate('categories')}
            onOpenAddresses={() => {
              setAccountSection('addresses');
              navigate('account');
            }}
            onCompleteOrder={handleCompleteOrder}
          />
        )}

        {(currentView === 'orders' || currentView === 'tracking') && (
          <OrdersTrackingView
            lang={lang}
            mode={currentView === 'tracking' ? 'tracking' : 'orders'}
            orders={orders}
            activeTrackingOrderId={activeTrackingOrderId}
            onSelectTrackingOrder={(oid) => {
              setActiveTrackingOrderId(oid);
              navigate('tracking');
            }}
            onBackToOrders={() => navigate('orders')}
            onConfirmDeliveryOtp={handleConfirmDeliveryOtp}
            onReorder={(order) => {
              order.items.forEach((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (product) handleAddToCart(product, item.quantity);
              });
              navigate('cart');
            }}
          />
        )}

        {currentView === 'account' && (
          <AccountWalletView
            lang={lang}
            section={accountSection}
            onChangeSection={setAccountSection}
            user={user}
            walletBalance={walletBalance}
            transactions={transactions}
            addresses={addresses}
            ordersCount={orders.length}
            wishlistCount={wishlist.length}
            onTopUpWallet={handleTopUpWallet}
            onAddAddress={handleAddAddress}
            onSetDefaultAddress={handleSetDefaultAddress}
            onDeleteAddress={handleDeleteAddress}
            onToggleAuth={(newPhone) => {
              setUser((u) => ({
                ...u,
                signedIn: !u.signedIn,
                phone: newPhone || u.phone,
              }));
            }}
            onOpenOrders={() => navigate('orders')}
            onOpenWishlist={() => navigate('wishlist')}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="hidden border-t border-slate-200/80 bg-white md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-slate-500 lg:px-8">
          <p>MINI-B Bénin · Cotonou, Abomey-Calavi & Porto-Novo · MTN MoMo, Moov Flooz & Wave</p>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setAccountSection('support');
                navigate('account');
              }}
              className="hover:text-[#4F28E8] cursor-pointer"
            >
              {lang === 'fr' ? 'Support & FAQ' : 'Support & FAQ'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAccountSection('addresses');
                navigate('account');
              }}
              className="hover:text-[#4F28E8] cursor-pointer"
            >
              {lang === 'fr' ? 'Zones de livraison' : 'Delivery Zones'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveVendorId('benin_hightech');
                navigate('vendor');
              }}
              className="hover:text-[#4F28E8] cursor-pointer"
            >
              {lang === 'fr' ? 'Boutiques certifiées' : 'Certified Merchants'}
            </button>
          </div>
        </div>
      </footer>

      <MobileBottomNav
        currentView={currentView}
        cartCount={cartCount}
        lang={lang}
        onNavigate={(v) => {
          if (v === 'account') setAccountSection('overview');
          navigate(v);
        }}
      />

      <OfflineIndicator lang={lang} />

      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          className="fixed top-18 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
