# TheLuxar API Entity Mapping

This document maps all entities from the frontend application to their corresponding types for backend implementation. These entities will serve as the foundation for our API database design.

## Core Entities

### BaseEntity
Common base for most entities:
```typescript
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
```

### User Entity
Leverages existing hello-identity user:
```typescript
export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string; // Not returned in responses
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles?: string[];
}
```

## Product Related Entities

### Product
```typescript
export interface Product extends BaseEntity {
  name: string;
  brand?: string;
  sku?: string;
  specs: string;
  imageUrl: string;
  description?: string;
  ingredients?: string;
  usageInstructions?: string;
  images: Array<{
    id: string;
    url: string;
    thumbnail?: string;
  }>;
  variants?: Array<{
    id: string;
    name: string;
    price?: number;
  }>;
  shortDescription?: string;
  active?: boolean;
  price: number;
  minPrice?: number;
  maxPrice?: number;
  currency: string;
  slug?: string;
  label?: ProductLabel;
  labelColor?: string;
  inStock: boolean;
  volume?: string;
  rating?: number | {
    count: number;
    average: number;
  };
  stocks?: Stock[];
  features?: string[];
  galleryImages?: string[];
  categories?: Category[]; // ManyToMany relation
}
```

### ProductLabel
```typescript
export type ProductLabel = 'SALE' | 'NOUVEAU' | 'SOLDE' | 'PROMO' | '-25% OFF' | 'BESTSELLER' | 'LUXURY' | 'NEW' | 'SIGNATURE' | 'LIMITED' | 'EXCLUSIVE' | 'PREMIUM' | null;
```

### Stock
```typescript
export interface Stock extends BaseEntity {
  productId: string; // Foreign key to Product
  quantity: number;
  price: number;
  characteristics?: Record<string, string>;
  isAvailable?: boolean;
  discount?: number;
  discounts?: Discount[];
  availabilityStatus?: StockAvailabilityStatus;
  keepingUnit?: string;
  guarantee?: TimeLapse;
  pictures?: string[];
  description?: {
    shortDescription: string | null;
    longDescription: string[] | null;
  } | null;
  manualPdf?: string | null;
  deliveryDuration?: TimeLapse | null;
  reviews?: Review[];
}
```

### StockAvailabilityStatus
```typescript
export enum StockAvailabilityStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  BACKORDER = 'BACKORDER',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}
```

### Discount
```typescript
export interface Discount extends BaseEntity {
  stockId: string; // Foreign key to Stock
  percentage: number;
  minQuantityToOrder: number;
}
```

### TimeLapse
```typescript
export interface TimeLapse {
  amount: number;
  timeUnit: 'day' | 'week' | 'month' | 'year';
}
```

### Review
```typescript
export interface Review extends BaseEntity {
  productId: string; // Foreign key to Product
  userId?: string; // Foreign key to User (optional, could be anonymous)
  username: string; 
  name?: string; // For UI display
  comment: string;
  reviewText?: string; // For UI display
  rating: number;
  title?: string;
  date?: Date;
  verified?: boolean;
  helpful?: number;
  notHelpful?: number;
  content?: string;
  imageUrl?: string;
  position?: string;
}
```

### Category
```typescript
export interface Category extends BaseEntity {
  name: string;
  description?: string;
  parentId?: string; // Self-reference for hierarchical categories
  image?: string;
  products?: Product[]; // ManyToMany relation
}
```

### ServiceCategory
```typescript
export interface ServiceCategory extends BaseEntity {
  title: string;
  description: string;
  icon: string;
  features: string[];
}
```

## Shopping Related Entities

### Cart
```typescript
export interface Cart extends BaseEntity {
  userId: string; // Foreign key to User
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
```

### CartItem
```typescript
export interface CartItem extends BaseEntity {
  cartId: string; // Foreign key to Cart
  productId: string; // Foreign key to Product
  quantity: number;
  price: number; // Price at time of adding to cart
  discount?: number;
}
```

### Wishlist
```typescript
export interface Wishlist extends BaseEntity {
  userId: string; // Foreign key to User
  items: WishlistItem[];
}
```

### WishlistItem
```typescript
export interface WishlistItem extends BaseEntity {
  wishlistId: string; // Foreign key to Wishlist
  productId: string; // Foreign key to Product
  addedAt: Date;
}
```

### Order
```typescript
export interface Order extends BaseEntity {
  userId: string; // Foreign key to User
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  deliveryMethod: string;
  trackingNumber?: string;
  notes?: string;
}
```

### OrderItem
```typescript
export interface OrderItem extends BaseEntity {
  orderId: string; // Foreign key to Order
  productId: string; // Foreign key to Product
  productData: Partial<Product>; // Snapshot of product at time of order
  quantity: number;
  price: number;
  discount?: number;
  total: number;
}
```

### OrderStatus
```typescript
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED'
}
```

### Address
```typescript
export interface Address extends BaseEntity {
  userId: string; // Foreign key to User
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
  type: 'SHIPPING' | 'BILLING';
}
```

## Additional Supporting Entities

### ProductDescription
```typescript
export interface SpecItem {
  label: string;
  value: string;
}

export interface CoreFeature {
  icon: string;
  label: string;
  value: string;
}

export interface IncludedItem {
  icon: string;
  label: string;
  note?: string;
}
```

### ProductFilter
```typescript
export interface FilterOption {
  name: string;
  value: string;
  icon?: string;
  count?: number;
  checked?: boolean;
}

export interface FilterCategory {
  title: string;
  type: 'radio' | 'checkbox' | 'text' | 'icon';
  options: FilterOption[];
  icon?: string;
}
```

## Implementation Notes

1. **Database Relations**:
   - Products to Categories (Many-to-Many)
   - Products to Stocks (One-to-Many)
   - Products to Reviews (One-to-Many)
   - Stocks to Discounts (One-to-Many)
   - Users to Carts (One-to-One)
   - Users to Wishlists (One-to-One)
   - Users to Orders (One-to-Many)
   - Users to Addresses (One-to-Many)

2. **Authentication Integration**:
   - Leverage existing hello-identity authentication
   - Implement role-based access control for product management

3. **File Storage**:
   - Implement storage solution for product images, manuals, etc.
   - Consider cloud storage options with CDN for global access

4. **Search Functionality**:
   - Implement indexing for efficient product search
   - Consider full-text search capabilities

5. **Performance Considerations**:
   - Optimize database queries for product listings
   - Implement caching strategies for frequently accessed products
