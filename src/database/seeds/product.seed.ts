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
  categories: Category[],
): Promise<{
  products: Product[];
  stocks: Stock[];
  reviews: Review[];
}> {
  console.log('Seeding products...');

  // Find categories by name
  const findCategoryByName = (name: string) =>
    categories.find((c) => c.name === name);
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
      description:
        'Exquisite infinity pendant featuring brilliant-cut diamonds set in 18K rose gold',
      usageInstructions:
        'Store in jewelry box when not in use. Clean with soft cloth.',
      images: [
        {
          id: '1-1',
          url: 'assets/images/products/diamond-pendant.jpg',
          thumbnail: 'assets/images/products/diamond-pendant-thumb.jpg',
        },
        { id: '1-2', url: 'assets/images/products/diamond-pendant-2.jpg' },
        { id: '1-3', url: 'assets/images/products/diamond-pendant.jpg' },
        { id: '1-4', url: 'assets/images/products/diamond-pendant-2.jpg' },
        { id: '1-5', url: 'assets/images/products/diamond-pendant.jpg' },
      ],
      label: ProductLabel.LUXURY,
      labelColor: '#e8b4a6',
      inStock: true,
      active: true,
      minPrice: 1250.0,
      maxPrice: 1250.0,
      slug: 'diamond-infinity-pendant',
      volume: null,
      features: [
        'Conflict-free diamonds',
        'Handcrafted in Italy',
        'Certificate of authenticity included',
      ],
      galleryImages: [
        'assets/images/products/diamond-pendant-gallery1.jpg',
        'assets/images/products/diamond-pendant-gallery2.jpg',
        'assets/images/products/diamond-pendant.jpg',
        'assets/images/products/diamond-pendant-2.jpg',
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
      description:
        'Precision Swiss-made automatic chronograph with sapphire crystal and exhibition caseback',
      images: [
        { id: '2-1', url: 'assets/images/products/luxury-watch.jpg' },
        { id: '2-2', url: 'assets/images/products/luxury-watch.jpg' },
        { id: '2-3', url: 'assets/images/products/luxury-watch.jpg' },
        { id: '2-4', url: 'assets/images/products/luxury-watch.jpg' },
      ],
      galleryImages: [
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
      ],
      inStock: true,
      active: true,
      minPrice: 3500.0,
      maxPrice: 3500.0,
      slug: 'swiss-chronograph-watch',
      features: [
        'Swiss-made movement',
        '100m water resistance',
        '5-year warranty',
      ],
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
      description:
        'Elegant tennis bracelet featuring alternating blue sapphires and white diamonds in 14K white gold',
      images: [
        { id: '3-1', url: 'assets/images/products/tennis-bracelet.jpg' },
        { id: '3-2', url: 'assets/images/products/tennis-bracelet.jpg' },
        { id: '3-3', url: 'assets/images/products/tennis-bracelet.jpg' },
        { id: '3-4', url: 'assets/images/products/tennis-bracelet.jpg' },
      ],
      galleryImages: [
        'assets/images/products/tennis-bracelet.jpg',
        'assets/images/products/tennis-bracelet.jpg',
        'assets/images/products/tennis-bracelet.jpg',
      ],
      inStock: true,
      active: true,
      minPrice: 4200.0,
      maxPrice: 4200.0,
      slug: 'sapphire-diamond-tennis-bracelet',
      features: [
        'Natural sapphires and diamonds',
        'Secure clasp',
        'Adjustable length',
      ],
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
      description:
        'Delicate angel wing pendant crafted for children with small diamonds and 14K yellow gold',
      images: [
        { id: '8-1', url: 'assets/images/products/kids-pendant.jpg' },
        { id: '8-2', url: 'assets/images/products/kids-pendant.jpg' },
        { id: '8-3', url: 'assets/images/products/kids-pendant.jpg' },
      ],
      galleryImages: [
        'assets/images/products/kids-pendant.jpg',
        'assets/images/products/kids-pendant.jpg',
        'assets/images/products/kids-pendant.jpg',
      ],
      inStock: true,
      active: true,
      minPrice: 350.0,
      maxPrice: 350.0,
      slug: 'children-angel-wing-pendant',
      features: [
        'Child-safe clasp',
        'Adjustable chain length',
        'Gift box included',
      ],
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
      label: ProductLabel.LUXURY,
      labelColor: '#e8b4a6',
      description:
        'Exquisite iris-based fragrance with notes of amber, vanilla, and cashmere wood',
      images: [
        { id: '6-1', url: 'assets/images/products/luxury-perfume.jpg' },
        { id: '6-2', url: 'assets/images/products/luxury-perfume.jpg' },
        { id: '6-3', url: 'assets/images/products/luxury-perfume.jpg' },
        { id: '6-4', url: 'assets/images/products/luxury-perfume.jpg' },
      ],
      galleryImages: [
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
      ],
      shortDescription: 'Sophisticated fragrance for the modern woman',
      inStock: true,
      active: true,
      minPrice: 380.0,
      maxPrice: 380.0,
      slug: 'exclusive-iris-parfum',
      volume: '100ml',
      features: [
        'Long-lasting fragrance',
        'Luxury crystal bottle',
        'Signature scent',
      ],
      categories: [perfumesCategory],
    },
    {
      name: 'Platinum Emerald Ring',
      brand: 'TheLuxar',
      sku: 'LUX-JP-003',
      specs: 'Platinum, Colombian Emerald 1.2ct, Diamonds 0.5ct',
      price: 5800.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/diamond-pendant.jpg',
      description:
        'Stunning platinum ring featuring a Colombian emerald center stone surrounded by brilliant-cut diamonds',
      usageInstructions:
        'Store separately to avoid scratches. Clean with professional jewelry cleaner.',
      images: [
        { id: '10-1', url: 'assets/images/products/diamond-pendant.jpg' },
        { id: '10-2', url: 'assets/images/products/diamond-pendant-2.jpg' },
        { id: '10-3', url: 'assets/images/products/diamond-pendant.jpg' },
        { id: '10-4', url: 'assets/images/products/diamond-pendant-2.jpg' },
      ],
      label: ProductLabel.LUXURY,
      labelColor: '#e8b4a6',
      inStock: true,
      active: true,
      minPrice: 5800.0,
      maxPrice: 5800.0,
      slug: 'platinum-emerald-ring',
      volume: null,
      rating: { count: 8, average: 4.9 },
      features: [
        'GIA certified emerald',
        'Conflict-free diamonds',
        'Custom sizing available',
      ],
      galleryImages: [
        'assets/images/products/diamond-pendant.jpg',
        'assets/images/products/diamond-pendant-2.jpg',
        'assets/images/products/diamond-pendant.jpg',
        'assets/images/products/diamond-pendant-2.jpg',
      ],
      categories: [jewelryCategory],
    },
    {
      name: 'Gold Pearl Drop Earrings',
      brand: 'TheLuxar',
      sku: 'LUX-JP-004',
      specs: '18K Yellow Gold, South Sea Pearls',
      price: 2200.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/tennis-bracelet.jpg',
      description:
        'Elegant drop earrings featuring lustrous South Sea pearls set in 18K yellow gold',
      usageInstructions:
        'Wipe with soft cloth after wearing. Store in jewelry pouch.',
      images: [
        { id: '11-1', url: 'assets/images/products/tennis-bracelet.jpg' },
        { id: '11-2', url: 'assets/images/products/tennis-bracelet.jpg' },
        { id: '11-3', url: 'assets/images/products/tennis-bracelet.jpg' },
      ],
      label: ProductLabel.NEW,
      labelColor: '#a6e8c9',
      inStock: true,
      active: true,
      minPrice: 2200.0,
      maxPrice: 2200.0,
      slug: 'gold-pearl-drop-earrings',
      volume: null,
      rating: { count: 12, average: 4.7 },
      features: [
        'Natural South Sea pearls',
        'Secure locking backs',
        'Gift box included',
      ],
      galleryImages: [
        'assets/images/products/tennis-bracelet.jpg',
        'assets/images/products/tennis-bracelet.jpg',
        'assets/images/products/tennis-bracelet.jpg',
      ],
      categories: [jewelryCategory],
    },
    {
      name: 'Rose Gold Diamond Bangle',
      brand: 'TheLuxar',
      sku: 'LUX-JP-005',
      specs: '18K Rose Gold, 0.75ct Diamonds',
      price: 3200.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/diamond-pendant.jpg',
      description:
        'Modern bangle bracelet featuring a line of brilliant-cut diamonds set in 18K rose gold',
      usageInstructions:
        'Remove before swimming or bathing. Clean with professional jewelry cleaner.',
      images: [
        { id: '12-1', url: 'assets/images/products/diamond-pendant.jpg' },
        { id: '12-2', url: 'assets/images/products/diamond-pendant-2.jpg' },
        { id: '12-3', url: 'assets/images/products/diamond-pendant.jpg' },
      ],
      variants: [
        { id: 'var-1', name: 'Small', price: 3200.0 },
        { id: 'var-2', name: 'Medium', price: 3400.0 },
        { id: 'var-3', name: 'Large', price: 3600.0 },
      ],
      label: ProductLabel.SALE,
      labelColor: '#e8a6a6',
      inStock: true,
      active: true,
      minPrice: 3200.0,
      maxPrice: 3600.0,
      slug: 'rose-gold-diamond-bangle',
      volume: null,
      rating: { count: 6, average: 4.5 },
      features: [
        'Hinged design for easy wear',
        'Conflict-free diamonds',
        'Available in multiple sizes',
      ],
      galleryImages: [
        'assets/images/products/diamond-pendant.jpg',
        'assets/images/products/diamond-pendant-2.jpg',
        'assets/images/products/diamond-pendant.jpg',
      ],
      categories: [jewelryCategory],
    },
    {
      name: 'Sapphire Tourbillon Watch',
      brand: 'TheLuxar',
      sku: 'LUX-WA-002',
      specs: 'Tourbillon Movement, Sapphire Crystal, Alligator Strap',
      price: 18500.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/luxury-watch.jpg',
      description:
        'Exceptional tourbillon timepiece featuring a hand-finished movement visible through sapphire crystal',
      usageInstructions:
        'Automatic winding. Service recommended every 5 years.',
      images: [
        { id: '13-1', url: 'assets/images/products/luxury-watch.jpg' },
        { id: '13-2', url: 'assets/images/products/luxury-watch.jpg' },
        { id: '13-3', url: 'assets/images/products/luxury-watch.jpg' },
      ],
      shortDescription: 'Masterpiece of horological craftsmanship',
      inStock: true,
      active: true,
      minPrice: 18500.0,
      maxPrice: 18500.0,
      slug: 'sapphire-tourbillon-watch',
      volume: null,
      rating: { count: 4, average: 5.0 },
      features: [
        '72-hour power reserve',
        'Hand-stitched alligator strap',
        'Water resistant to 50m',
        'Limited edition of 100 pieces',
      ],
      galleryImages: [
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
      ],
      categories: [watchesCategory],
    },
    {
      name: 'Diamond Ladies Watch',
      brand: 'TheLuxar',
      sku: 'LUX-WA-003',
      specs: 'Swiss Quartz Movement, Mother of Pearl Dial, Diamond Bezel',
      price: 6800.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/luxury-watch.jpg',
      description:
        'Elegant ladies timepiece featuring mother of pearl dial and diamond-set bezel on a silk strap',
      usageInstructions:
        'Battery replacement recommended every 2 years. Keep away from water.',
      images: [
        { id: '14-1', url: 'assets/images/products/luxury-watch.jpg' },
        { id: '14-2', url: 'assets/images/products/luxury-watch.jpg' },
      ],
      inStock: true,
      active: true,
      minPrice: 6800.0,
      maxPrice: 6800.0,
      slug: 'diamond-ladies-watch',
      volume: null,
      rating: { count: 9, average: 4.8 },
      features: [
        'Mother of pearl dial',
        'Diamond-set bezel',
        '2-year warranty',
        'Interchangeable strap system',
      ],
      galleryImages: [
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
        'assets/images/products/luxury-watch.jpg',
      ],
      categories: [watchesCategory, jewelryCategory],
    },
    {
      name: 'Oud & Amber Cologne',
      brand: 'TheLuxar',
      sku: 'LUX-PF-002',
      specs: 'Eau de Parfum, 75ml',
      price: 420.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/luxury-perfume.jpg',
      description:
        'Rich and luxurious fragrance for men featuring rare oud, amber and sandalwood notes',
      usageInstructions: 'Apply to pulse points. Avoid contact with eyes.',
      ingredients:
        'Alcohol, Aqua, Parfum, Agarwood Extract, Amber Extract, Sandalwood Oil',
      images: [
        { id: '15-1', url: 'assets/images/products/luxury-perfume.jpg' },
        { id: '15-2', url: 'assets/images/products/luxury-perfume.jpg' },
        { id: '15-3', url: 'assets/images/products/luxury-perfume.jpg' },
      ],
      shortDescription: 'Sophisticated oud fragrance for the modern gentleman',
      inStock: true,
      active: true,
      minPrice: 420.0,
      maxPrice: 420.0,
      slug: 'oud-amber-cologne',
      volume: '75ml',
      rating: { count: 15, average: 4.9 },
      features: [
        'Long-lasting fragrance',
        'Hand-crafted crystal bottle',
        'Natural ingredients',
      ],
      galleryImages: [
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
      ],
      categories: [perfumesCategory],
    },
    {
      name: 'Rose & Vanilla Parfum',
      brand: 'TheLuxar',
      sku: 'LUX-PF-003',
      specs: 'Eau de Parfum, 50ml',
      price: 350.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/luxury-perfume.jpg',
      description:
        'Delicate floral fragrance featuring Bulgarian rose and Madagascar vanilla',
      usageInstructions:
        'Apply to pulse points. Store in a cool, dry place away from direct sunlight.',
      ingredients:
        'Alcohol, Aqua, Parfum, Rosa Damascena Oil, Vanilla Extract, Bergamot Oil',
      images: [
        { id: '16-1', url: 'assets/images/products/luxury-perfume.jpg' },
        { id: '16-2', url: 'assets/images/products/luxury-perfume.jpg' },
      ],
      shortDescription: 'Elegant rose and vanilla fragrance',
      inStock: true,
      active: true,
      minPrice: 350.0,
      maxPrice: 350.0,
      slug: 'rose-vanilla-parfum',
      volume: '50ml',
      rating: { count: 18, average: 4.7 },
      features: [
        'Made with natural extracts',
        'Elegant bottle design',
        'Gift box included',
      ],
      galleryImages: [
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
        'assets/images/products/luxury-perfume.jpg',
      ],
      categories: [perfumesCategory],
    },
    {
      name: "Children's Gold ID Bracelet",
      brand: 'TheLuxar Kids',
      sku: 'LUX-KD-002',
      specs: '14K Yellow Gold',
      price: 280.0,
      currency: 'XAF',
      imageUrl: 'assets/images/products/kids-pendant.jpg',
      description:
        'Customizable ID bracelet for children crafted in 14K yellow gold with adjustable chain',
      usageInstructions:
        'Adjustable sizing for growth. Clean with mild soap and water.',
      images: [
        { id: '17-1', url: 'assets/images/products/kids-pendant.jpg' },
        { id: '17-2', url: 'assets/images/products/kids-pendant.jpg' },
      ],
      variants: [
        { id: 'kid-var-1', name: 'Plain', price: 280.0 },
        { id: 'kid-var-2', name: 'Engraved', price: 320.0 },
      ],
      label: ProductLabel.NEW,
      labelColor: '#a6c9e8',
      inStock: true,
      active: true,
      minPrice: 280.0,
      maxPrice: 320.0,
      slug: 'children-gold-id-bracelet',
      volume: null,
      rating: { count: 7, average: 4.6 },
      features: [
        'Customizable engraving',
        'Safety clasp',
        'Adjustable length',
        'Gift packaging',
      ],
      galleryImages: [
        'assets/images/products/kids-pendant.jpg',
        'assets/images/products/kids-pendant.jpg',
        'assets/images/products/kids-pendant.jpg',
      ],
      categories: [kidsCategory, jewelryCategory],
    },
  ]);

  // Map products by name for easier reference
  const productMap = new Map(products.map((p) => [p.name, p]));

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
      characteristics: {
        material: 'Stainless Steel',
        movement: 'Swiss Automatic',
      },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-WA-001-001',
    },
    {
      productId: productMap.get('Platinum Emerald Ring').id,
      quantity: 5,
      price: 5800.0,
      characteristics: {
        material: 'Platinum',
        stone: 'Emerald 1.2ct, Diamonds 0.5ct',
      },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-003-001',
      pictures: ['assets/images/products/diamond-pendant.jpg'],
      description: {
        shortDescription: 'Stunning platinum and emerald ring',
        longDescription: [
          'GIA certified Colombian emerald surrounded by brilliant-cut diamonds',
        ],
      },
    },
    {
      productId: productMap.get('Gold Pearl Drop Earrings').id,
      quantity: 10,
      price: 2200.0,
      characteristics: {
        material: '18K Yellow Gold',
        stone: 'South Sea Pearls',
      },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-004-001',
      pictures: ['assets/images/products/tennis-bracelet.jpg'],
      description: {
        shortDescription: 'Elegant pearl drop earrings',
        longDescription: [
          'South Sea pearls set in 18K yellow gold with secure locking backs',
        ],
      },
    },
    {
      productId: productMap.get('Rose Gold Diamond Bangle').id,
      quantity: 7,
      price: 3200.0,
      characteristics: { material: '18K Rose Gold', stone: 'Diamonds 0.75ct' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-005-001-S',
      pictures: ['assets/images/products/diamond-pendant.jpg'],
      description: {
        shortDescription: 'Modern diamond bangle - Small',
        longDescription: [
          'Brilliant-cut diamonds set in 18K rose gold with hinged design',
        ],
      },
    },
    {
      productId: productMap.get('Rose Gold Diamond Bangle').id,
      quantity: 5,
      price: 3400.0,
      characteristics: { material: '18K Rose Gold', stone: 'Diamonds 0.85ct' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-005-002-M',
      pictures: ['assets/images/products/diamond-pendant.jpg'],
      description: {
        shortDescription: 'Modern diamond bangle - Medium',
        longDescription: [
          'Brilliant-cut diamonds set in 18K rose gold with hinged design',
        ],
      },
    },
    {
      productId: productMap.get('Rose Gold Diamond Bangle').id,
      quantity: 3,
      price: 3600.0,
      characteristics: { material: '18K Rose Gold', stone: 'Diamonds 0.95ct' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-005-003-L',
      pictures: ['assets/images/products/diamond-pendant.jpg'],
      description: {
        shortDescription: 'Modern diamond bangle - Large',
        longDescription: [
          'Brilliant-cut diamonds set in 18K rose gold with hinged design',
        ],
      },
    },
    {
      productId: productMap.get('Sapphire Tourbillon Watch').id,
      quantity: 2,
      price: 18500.0,
      characteristics: {
        material: 'Platinum, Sapphire Crystal',
        movement: 'Swiss Tourbillon',
        strap: 'Alligator Leather',
      },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.LOW_STOCK,
      keepingUnit: 'LUX-WA-002-001',
      pictures: ['assets/images/products/luxury-watch.jpg'],
      description: {
        shortDescription: 'Exceptional tourbillon timepiece',
        longDescription: [
          'Limited edition of 100 pieces with hand-finished movement visible through sapphire crystal',
        ],
      },
    },
    {
      productId: productMap.get('Diamond Ladies Watch').id,
      quantity: 6,
      price: 6800.0,
      characteristics: {
        material: '18K White Gold, Diamonds',
        movement: 'Swiss Quartz',
        dial: 'Mother of Pearl',
      },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-WA-003-001',
      pictures: ['assets/images/products/luxury-watch.jpg'],
      description: {
        shortDescription: 'Elegant ladies diamond timepiece',
        longDescription: [
          'Mother of pearl dial and diamond-set bezel on a silk strap with interchangeable strap system',
        ],
      },
    },
    {
      productId: productMap.get('Oud & Amber Cologne').id,
      quantity: 15,
      price: 420.0,
      characteristics: { volume: '75ml', type: 'Eau de Parfum' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-PF-002-001',
      pictures: ['assets/images/products/luxury-perfume.jpg'],
      description: {
        shortDescription: 'Luxurious oud and amber fragrance for men',
        longDescription: [
          'Rich and complex aroma with natural oud, amber and sandalwood',
        ],
      },
    },
    {
      productId: productMap.get('Rose & Vanilla Parfum').id,
      quantity: 20,
      price: 350.0,
      characteristics: { volume: '50ml', type: 'Eau de Parfum' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-PF-003-001',
      pictures: ['assets/images/products/luxury-perfume.jpg'],
      description: {
        shortDescription: 'Elegant floral fragrance',
        longDescription: [
          'Delicate blend of Bulgarian rose and Madagascar vanilla in an elegant crystal bottle',
        ],
      },
    },
    {
      productId: productMap.get("Children's Gold ID Bracelet").id,
      quantity: 8,
      price: 280.0,
      characteristics: { material: '14K Yellow Gold', style: 'Plain' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-KD-002-001-P',
      pictures: ['assets/images/products/kids-pendant.jpg'],
      description: {
        shortDescription: "Children's ID bracelet - Plain",
        longDescription: [
          'Adjustable gold ID bracelet for children with safety clasp',
        ],
      },
    },
    {
      productId: productMap.get("Children's Gold ID Bracelet").id,
      quantity: 5,
      price: 320.0,
      characteristics: { material: '14K Yellow Gold', style: 'Engraved' },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-KD-002-002-E',
      pictures: ['assets/images/products/kids-pendant.jpg'],
      description: {
        shortDescription: "Children's ID bracelet - Engraved",
        longDescription: [
          'Adjustable gold ID bracelet for children with custom engraving and safety clasp',
        ],
      },
    },
    {
      productId: productMap.get('Sapphire and Diamond Tennis Bracelet').id,
      quantity: 5,
      price: 4200.0,
      characteristics: {
        material: '14K White Gold',
        stones: 'Sapphires and Diamonds',
      },
      isAvailable: true,
      availabilityStatus: StockAvailabilityStatus.IN_STOCK,
      keepingUnit: 'LUX-JP-002-001',
    },
    {
      productId: productMap.get("Children's Angel Wing Pendant").id,
      quantity: 15,
      price: 350.0,
      characteristics: {
        material: '14K Yellow Gold',
        accents: 'Small Diamonds',
      },
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
      name: 'Jean-Pierre Kouamé',
      comment:
        'The Baobab Chronograph watch is an engineering marvel. As a watch enthusiast, I appreciate the precision Swiss movement.',
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
      comment:
        "TheLuxar's Royal Amber perfume is intoxicating! The combination of amber, vanilla, and exotic spices creates a warm, sophisticated scent that lasts all day.",
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
