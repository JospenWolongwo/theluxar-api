import { DataSource } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Stock } from '../../stock/entities/stock.entity';
import { Review } from '../../review/entities/review.entity';
import { StockAvailabilityStatus } from '../../stock/types/stock-availability-status.enum';
import { Category } from '../../category/entities/category.entity';
import { cleanEntity, createEntities, logSeedCompletion } from './utils';
import { ProductLabel } from '../../product/types/product-label.type';

/**
 * Clean product-related data from database
 * @param db Database connection
 */
export async function cleanProducts(db: DataSource): Promise<void> {
  console.log('Cleaning products data...');
  
  await cleanEntity(db, Review, '1=1', {});
  await cleanEntity(db, Stock, '1=1', {});
  await cleanEntity(db, Product, '1=1', {});
}

/**
 * Seed products data
 * @param db Database connection
 * @param categories The categories to associate products with
 */
export async function seedProducts(
  db: DataSource, 
  categories: Category[]
): Promise<{
  products: Product[];
  stocks: Stock[];
  reviews: Review[];
}> {
  console.log('Seeding products...');

  // Find categories by name
  const findCategoryByName = (name: string) => categories.find(c => c.name === name);
  const jewelryCategory = findCategoryByName('Jewelry');
  const watchesCategory = findCategoryByName('Watches');
  const perfumesCategory = findCategoryByName('Perfumes');
  const kidsCategory = findCategoryByName('Kids');
  
  // Create products based on frontend data
  const products = await createEntities<Product>(db, Product, [
    {
      name: 'Diamond Infinity Pendant',
      brand: 'TheLuxar',
      sku: 'LUX-JP-001',
      specs: '18K Rose Gold, 0.5ct Diamond',
      price: 1250.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/diamond-pendant.jpg',
      description: 'Exquisite infinity pendant featuring brilliant-cut diamonds set in 18K rose gold',
      usageInstructions: 'Store in jewelry box when not in use. Clean with soft cloth.',
      images: [
        {
          id: '1-1',
          url: 'assets/images/products/diamond-pendant.jpg',
          thumbnail: 'assets/images/products/diamond-pendant-thumb.jpg',
        },
        { id: '1-2', url: 'assets/images/products/diamond-pendant-2.jpg' },
      ],
      label: 'LUXURY',
      labelColor: '#e8b4a6',
      inStock: true,
      active: true,
      minPrice: 1250.0,
      maxPrice: 1250.0,
      slug: 'diamond-infinity-pendant',
      volume: null,
      features: ['Conflict-free diamonds', 'Handcrafted in Italy', 'Certificate of authenticity included'],
      galleryImages: [
        'assets/images/products/diamond-pendant-gallery1.jpg',
        'assets/images/products/diamond-pendant-gallery2.jpg',
      ],
      categories: [jewelryCategory],
    },
    {
      name: 'Swiss Chronograph Watch',
      brand: 'TheLuxar',
      sku: 'LUX-WA-001',
      specs: 'Automatic Movement, Sapphire Crystal',
      price: 3500.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/luxury-watch.jpg',
      description: 'Precision Swiss-made automatic chronograph with sapphire crystal and exhibition caseback',
      images: [{ id: '2-1', url: 'assets/images/products/luxury-watch.jpg' }],
      inStock: true,
      active: true,
      minPrice: 3500.0,
      maxPrice: 3500.0,
      slug: 'swiss-chronograph-watch',
      features: ['Swiss-made movement', '100m water resistance', '5-year warranty'],
      categories: [watchesCategory],
    },
    {
      name: 'Sapphire and Diamond Tennis Bracelet',
      brand: 'TheLuxar',
      sku: 'LUX-JP-002',
      specs: '14K White Gold, Blue Sapphires and Diamonds',
      price: 4200.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/tennis-bracelet.jpg',
      label: ProductLabel.NEW,
      labelColor: '#e8b4a6',
      description: 'Elegant tennis bracelet featuring alternating blue sapphires and white diamonds in 14K white gold',
      images: [{ id: '3-1', url: 'assets/images/products/tennis-bracelet.jpg' }],
      inStock: true,
      active: true,
      minPrice: 4200.0,
      maxPrice: 4200.0,
      slug: 'sapphire-diamond-tennis-bracelet',
      features: ['Natural sapphires and diamonds', 'Secure clasp', 'Adjustable length'],
      categories: [jewelryCategory],
    },
    {
      name: "Children's Angel Wing Pendant",
      brand: 'TheLuxar Kids',
      sku: 'LUX-KD-001',
      specs: '14K Yellow Gold, Small Diamonds',
      price: 350.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/kids-pendant.jpg',
      label: ProductLabel.NEW,
      labelColor: '#e8b4a6',
      description: 'Delicate angel wing pendant crafted for children with small diamonds and 14K yellow gold',
      images: [{ id: '8-1', url: 'assets/images/products/kids-pendant.jpg' }],
      inStock: true,
      active: true,
      minPrice: 350.0,
      maxPrice: 350.0,
      slug: 'children-angel-wing-pendant',
      features: ['Child-safe clasp', 'Adjustable chain length', 'Gift box included'],
      categories: [kidsCategory, jewelryCategory],
    },
    {
      name: 'Exclusive Iris Parfum',
      brand: 'TheLuxar',
      sku: 'LUX-PF-001',
      specs: 'Eau de Parfum, 100ml',
      price: 380.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/luxury-perfume.jpg',
      label: 'LUXURY',
      labelColor: '#e8b4a6',
      description: 'Exquisite iris-based fragrance with notes of amber, vanilla, and cashmere wood',
      images: [{ id: '6-1', url: 'assets/images/products/luxury-perfume.jpg' }],
      shortDescription: 'Sophisticated fragrance for the modern woman',
      inStock: true,
      active: true,
      minPrice: 380.0,
      maxPrice: 380.0,
      slug: 'exclusive-iris-parfum',
      volume: '100ml',
      features: ['Long-lasting fragrance', 'Luxury crystal bottle', 'Signature scent'],
      categories: [perfumesCategory],
    },
  ]);
  
  // Map products by name for easier reference
  const productMap = new Map(products.map(p => [p.name, p]));
  
  // Create stocks for products
  const stocks = await createEntities<Stock>(db, Stock, [
    {
      productId: productMap.get('Diamond Infinity Pendant').id,
      quantity: 12,
      price: 1250.0,
      characteristics: { material: '18K Rose Gold', stone: '0.5ct Diamond' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-001-001',
      pictures: ['assets/images/products/diamond-pendant.jpg'],
      description: {
        shortDescription: 'Exquisite infinity pendant with diamonds',
        longDescription: ['Handcrafted in Italy with conflict-free diamonds'],
      },
    },
    {
      productId: productMap.get('Swiss Chronograph Watch').id,
      quantity: 8,
      price: 3500.0,
      characteristics: { material: 'Stainless Steel', movement: 'Swiss Automatic' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-WA-001-001',
    },
    {
      productId: productMap.get('Sapphire and Diamond Tennis Bracelet').id,
      quantity: 5,
      price: 4200.0,
      characteristics: { material: '14K White Gold', stones: 'Sapphires and Diamonds' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-002-001',
    },
    {
      productId: productMap.get("Children's Angel Wing Pendant").id,
      quantity: 15,
      price: 350.0,
      characteristics: { material: '14K Yellow Gold', accents: 'Small Diamonds' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-KD-001-001',
    },
    {
      productId: productMap.get('Exclusive Iris Parfum').id,
      quantity: 25,
      price: 380.0,
      characteristics: { type: 'Eau de Parfum', volume: '100ml' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-PF-001-001',
    },
  ]);
  
  // Create reviews for products
  const reviews = await createEntities<Review>(db, Review, [
    {
      productId: productMap.get('Diamond Infinity Pendant').id,
      username: 'LuxuryEnthusiast',
      name: 'Samuel Okonkwo',
      comment: 'The craftsmanship is impeccable. Elegant and timeless.',
      rating: 5,
      title: 'Stunning craftsmanship',
      date: new Date('2023-05-10'),
      verified: true,
      helpful: 8,
      position: 'Business Executive',
      imageUrl: 'assets/images/reviews/floyd.png',
    },
    {
      productId: productMap.get('Swiss Chronograph Watch').id,
      username: 'WatchCollector',
      name: 'Jean-Pierre KouamÃ©',
      comment: 'The Baobab Chronograph watch is an engineering marvel. As a watch enthusiast, I appreciate the precision Swiss movement.',
      rating: 5,
      title: 'Exceptional Timepiece',
      date: new Date('2023-04-15'),
      verified: true,
      position: 'Engineering Consultant',
    },
    {
      productId: productMap.get('Exclusive Iris Parfum').id,
      username: 'Scent_Lover',
      name: 'Fatima Ngala',
      comment: "TheLuxar's Royal Amber perfume is intoxicating! The combination of amber, vanilla, and exotic spices creates a warm, sophisticated scent that lasts all day.",
      rating: 5,
      title: 'Intoxicating fragrance',
      date: new Date('2023-06-22'),
      verified: true,
      position: 'University Professor',
    },
  ]);
  
  logSeedCompletion('Products');
  return { products, stocks, reviews };
}
