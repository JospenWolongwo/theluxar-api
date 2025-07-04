import { DataSource } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { WishlistItem } from '../../wishlist/entities/wishlist-item.entity';
import { Order } from '../../order/entities/order.entity';
import { OrderItem } from '../../order/entities/order-item.entity';
import { Address } from '../../address/entities/address.entity';
import { OrderStatus } from '../../order/enums/order-status.enum';
import { AddressType } from '../../address/enums/address-type.enum';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { cleanEntity, createEntities, logSeedCompletion } from './utils';

/**
 * Clean shopping-related data from database
 * @param db Database connection
 */
export async function cleanShopping(db: DataSource): Promise<void> {
  console.log('Cleaning shopping data...');
  
  // Clean in order to respect foreign key constraints
  await cleanEntity(db, OrderItem, '1=1', {});
  await cleanEntity(db, Order, '1=1', {});
  await cleanEntity(db, CartItem, '1=1', {});
  await cleanEntity(db, Cart, '1=1', {});
  await cleanEntity(db, WishlistItem, '1=1', {});
  await cleanEntity(db, Wishlist, '1=1', {});
  await cleanEntity(db, Address, '1=1', {});
}

/**
 * Seed addresses for users
 * @param db Database connection
 * @param users Array of users
 */
export async function seedAddresses(
  db: DataSource,
  users: User[]
): Promise<Address[]> {
  console.log('Seeding addresses...');
  
  // Find customer user
  const customer = users.find(u => u.email === 'customer@theluxar.com');
  
  if (!customer) {
    console.warn('Customer user not found. Skipping address seeding.');
    return [];
  }
  
  // Create addresses
  const addresses = await createEntities<Address>(db, Address, [
    {
      userId: customer.id,
      firstName: 'Customer',
      lastName: 'User',
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'Douala',
      state: 'Littoral',
      postalCode: '3000',
      country: 'Cameroon',
      phone: '+237 6 55 55 55 55',
      isDefault: true,
      type: AddressType.SHIPPING,
    },
    {
      userId: customer.id,
      firstName: 'Customer',
      lastName: 'User',
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'Douala',
      state: 'Littoral',
      postalCode: '3000',
      country: 'Cameroon',
      phone: '+237 6 55 55 55 55',
      isDefault: true,
      type: AddressType.BILLING,
    },
  ]);
  
  logSeedCompletion('Addresses');
  return addresses;
}

/**
 * Seed carts for users
 * @param db Database connection
 * @param users Array of users
 * @param products Array of products
 */
export async function seedCarts(
  db: DataSource,
  users: User[],
  products: Product[]
): Promise<{ carts: Cart[]; cartItems: CartItem[] }> {
  console.log('Seeding carts...');
  
  // Find customer user
  const customer = users.find(u => u.email === 'customer@theluxar.com');
  
  if (!customer) {
    console.warn('Customer user not found. Skipping cart seeding.');
    return { carts: [], cartItems: [] };
  }
  
  // Create cart
  const carts = await createEntities<Cart>(db, Cart, [
    {
      userId: customer.id,
      subtotal: 1250.0,
      discount: 0,
      tax: 187.5,
      total: 1437.5,
    },
  ]);
  
  const cart = carts[0];
  
  // Create cart items
  const cartItems = await createEntities<CartItem>(db, CartItem, [
    {
      cartId: cart.id,
      productId: products[0].id, // Diamond Infinity Pendant
      quantity: 1,
      price: 1250.0,
      discount: 0,
    },
  ]);
  
  // Update cart with items
  cart.items = cartItems;
  await db.getRepository(Cart).save(cart);
  
  logSeedCompletion('Carts');
  return { carts, cartItems };
}

/**
 * Seed wishlists for users
 * @param db Database connection
 * @param users Array of users
 * @param products Array of products
 */
export async function seedWishlists(
  db: DataSource,
  users: User[],
  products: Product[]
): Promise<{ wishlists: Wishlist[]; wishlistItems: WishlistItem[] }> {
  console.log('Seeding wishlists...');
  
  // Find customer user
  const customer = users.find(u => u.email === 'customer@theluxar.com');
  
  if (!customer) {
    console.warn('Customer user not found. Skipping wishlist seeding.');
    return { wishlists: [], wishlistItems: [] };
  }
  
  // Create wishlist
  const wishlists = await createEntities<Wishlist>(db, Wishlist, [
    {
      userId: customer.id,
    },
  ]);
  
  const wishlist = wishlists[0];
  
  // Create wishlist items
  const wishlistItems = await createEntities<WishlistItem>(db, WishlistItem, [
    {
      wishlistId: wishlist.id,
      productId: products[1].id, // Swiss Chronograph Watch
      addedAt: new Date(),
    },
    {
      wishlistId: wishlist.id,
      productId: products[2].id, // Sapphire and Diamond Tennis Bracelet
      addedAt: new Date(),
    },
  ]);
  
  // Update wishlist with items
  wishlist.items = wishlistItems;
  await db.getRepository(Wishlist).save(wishlist);
  
  logSeedCompletion('Wishlists');
  return { wishlists, wishlistItems };
}

/**
 * Seed orders for users
 * @param db Database connection
 * @param users Array of users
 * @param products Array of products
 * @param addresses Array of addresses
 */
export async function seedOrders(
  db: DataSource,
  users: User[],
  products: Product[],
  addresses: Address[]
): Promise<{ orders: Order[]; orderItems: OrderItem[] }> {
  console.log('Seeding orders...');
  
  // Find customer user
  const customer = users.find(u => u.email === 'customer@theluxar.com');
  
  if (!customer) {
    console.warn('Customer user not found. Skipping order seeding.');
    return { orders: [], orderItems: [] };
  }
  
  const shippingAddress = addresses.find(a => a.type === AddressType.SHIPPING);
  const billingAddress = addresses.find(a => a.type === AddressType.BILLING);
  
  if (!shippingAddress || !billingAddress) {
    console.warn('Addresses not found. Skipping order seeding.');
    return { orders: [], orderItems: [] };
  }
  
  // Create order with completed status
  const completedOrder = await createEntities<Order>(db, Order, [
    {
      userId: customer.id,
      orderNumber: 'LUX-2023-001',
      subtotal: 4200.0,
      discount: 0,
      tax: 630.0,
      total: 4830.0,
      status: OrderStatus.DELIVERED,
      shippingAddress,
      billingAddress,
      paymentMethod: 'Credit Card',
      deliveryMethod: 'Express',
      trackingNumber: 'TRK123456789',
    },
  ]);
  
  // Create order with pending status
  const pendingOrder = await createEntities<Order>(db, Order, [
    {
      userId: customer.id,
      orderNumber: 'LUX-2023-002',
      subtotal: 380.0,
      discount: 0,
      tax: 57.0,
      total: 437.0,
      status: OrderStatus.PENDING,
      shippingAddress,
      billingAddress,
      paymentMethod: 'Credit Card',
      deliveryMethod: 'Standard',
    },
  ]);
  
  const orders = [...completedOrder, ...pendingOrder];
  
  // Create order items
  const orderItems = await createEntities<OrderItem>(db, OrderItem, [
    {
      orderId: completedOrder[0].id,
      productId: products[2].id, // Sapphire and Diamond Tennis Bracelet
      productData: {
        name: products[2].name,
        imageUrl: products[2].imageUrl,
        price: products[2].price,
      },
      quantity: 1,
      price: 4200.0,
      total: 4200.0,
    },
    {
      orderId: pendingOrder[0].id,
      productId: products[4].id, // Exclusive Iris Parfum
      productData: {
        name: products[4].name,
        imageUrl: products[4].imageUrl,
        price: products[4].price,
      },
      quantity: 1,
      price: 380.0,
      total: 380.0,
    },
  ]);
  
  // Update orders with items
  for (const order of orders) {
    order.items = orderItems.filter(item => item.orderId === order.id);
    await db.getRepository(Order).save(order);
  }
  
  logSeedCompletion('Orders');
  return { orders, orderItems };
}
