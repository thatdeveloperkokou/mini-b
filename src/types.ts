export type Language = 'fr' | 'en';

export type AppView =
  | 'home'
  | 'categories'
  | 'product'
  | 'vendor'
  | 'wishlist'
  | 'cart'
  | 'orders'
  | 'tracking'
  | 'account';

export type AccountSection = 'overview' | 'wallet' | 'addresses' | 'support';

export type CategoryId = 'all' | 'phones' | 'tech' | 'fashion' | 'beauty' | 'accessories';

export type PaymentMethodId =
  | 'mtn_momo'
  | 'moov_flooz'
  | 'celtiis_cash'
  | 'wave'
  | 'crypto'
  | 'card'
  | 'cod';

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta: number;
}

export interface ProductSpec {
  labelFr: string;
  labelEn: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  district: string;
  rating: number;
  dateFr: string;
  dateEn: string;
  commentFr: string;
  commentEn: string;
  verifiedVia: string;
  helpfulCount: number;
  vendorReply?: string;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabelFr: string;
  categoryLabelEn: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  district: string;
  deliveryEtaFr: string;
  deliveryEtaEn: string;
  image: string;
  gallery?: string[];
  vendorId: string;
  inStockLocal: boolean;
  isFlashDeal?: boolean;
  highlightTag?: string;
  descriptionFr: string;
  descriptionEn: string;
  colors?: string[];
  variants?: ProductVariant[];
  specs: ProductSpec[];
  reviews: Review[];
}

export interface Vendor {
  id: string;
  name: string;
  district: string;
  address: string;
  satisfaction: string;
  responseTime: string;
  salesCount: string;
  memberSince: string;
  bannerImage: string;
  descriptionFr: string;
  descriptionEn: string;
}

export interface CategoryMeta {
  id: Exclude<CategoryId, 'all'>;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  itemCount: number;
  image: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  color?: string;
  quantity: number;
}

export interface BeninAddress {
  id: string;
  label: string;
  district: string;
  city: string;
  landmark: string;
  contactName: string;
  phone: string;
  tag: 'Domicile' | 'Travail' | 'Famille';
  isDefault: boolean;
}

export interface TrackingStep {
  id: string;
  titleFr: string;
  titleEn: string;
  detailFr: string;
  detailEn: string;
  time: string;
  completed: boolean;
  active?: boolean;
}

export interface Order {
  id: string;
  date: string;
  status: 'in_progress' | 'delivered' | 'cancelled';
  items: {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    unitPrice: number;
    variantLabel?: string;
  }[];
  total: number;
  discount: number;
  deliveryFee: number;
  paymentMethodLabel: string;
  addressSummary: string;
  landmark: string;
  otpCode: string;
  etaMinutes: number;
  courier: {
    name: string;
    rating: string;
    reviews: number;
    vehicle: string;
    plate: string;
    phone: string;
  };
  steps: TrackingStep[];
}

export interface WalletTransaction {
  id: string;
  titleFr: string;
  titleEn: string;
  dateFr: string;
  dateEn: string;
  channel: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface UserProfile {
  name: string;
  phone: string;
  city: string;
  tier: string;
  rating: string;
  deliveriesCount: number;
  loyaltyPoints: number;
  signedIn: boolean;
}
