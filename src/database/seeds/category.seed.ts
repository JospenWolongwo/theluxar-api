import { DataSource } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { ServiceCategory } from '../../service-category/entities/service-category.entity';
import { cleanEntity, createEntities, logSeedCompletion } from './utils';

/**
 * Clean category-related data from database
 * @param db Database connection
 */
export async function cleanCategories(db: DataSource): Promise<void> {
  console.log('Cleaning categories data...');
  
  await cleanEntity(db, ServiceCategory, '1=1', {});
  await cleanEntity(db, Category, '1=1', {});
}

/**
 * Seed categories data
 * @param db Database connection
 */
export async function seedCategories(db: DataSource): Promise<{
  categories: Category[];
  serviceCategories: ServiceCategory[];
}> {
  console.log('Seeding categories...');
  
  // Create product categories based on frontend data
  const categories = await createEntities<Category>(db, Category, [
    {
      name: 'Jewelry',
      description: 'Exquisite handcrafted jewelry pieces that complement your unique style and elegance.',
      image: 'assets/images/categories/jewelry.jpg',
    },
    {
      name: 'Watches',
      description: 'Timeless elegance on your wrist with our collection of precision timepieces for all occasions.',
      image: 'assets/images/categories/watches.jpg',
    },
    {
      name: 'Perfumes',
      description: 'Discover signature scents crafted from the finest ingredients to suit every occasion.',
      image: 'assets/images/categories/perfumes.jpg',
    },
    {
      name: 'Kids',
      description: 'Special luxury items designed specifically for children of discerning parents.',
      image: 'assets/images/categories/kids.jpg',
    },
    {
      name: 'Accessories',
      description: 'Complement your look with our range of meticulously designed luxury accessories.',
      image: 'assets/images/categories/accessories.jpg',
    },
  ]);
  
  // Create service categories based on frontend data
  const serviceCategories = await createEntities<ServiceCategory>(db, ServiceCategory, [
    {
      title: 'Premium Jewelry',
      description: 'Exquisite handcrafted jewelry pieces that complement your unique style and elegance.',
      icon: 'assets/icons/jewelry-icon.png',
      features: [
        'Handcrafted designs',
        'Premium materials',
        'Lifetime warranty',
        'Custom sizing available',
      ],
    },
    {
      title: 'Luxury Watches',
      description: 'Timeless elegance on your wrist with our collection of precision timepieces for all occasions.',
      icon: 'assets/icons/watch-icon.png',
      features: ['Swiss movements', 'Water resistance', 'Sapphire crystal', 'Extended warranty'],
    },
    {
      title: 'Personal Styling',
      description: 'Expert styling consultation to help you find the perfect pieces that match your personality.',
      icon: 'assets/icons/styling-icon.png',
      features: ['Personal consultations', 'Event styling', 'Wardrobe recommendations', 'Trend analysis'],
    },
    {
      title: 'VIP Services',
      description: 'Exclusive services for our valued clients including private showings and priority access.',
      icon: 'assets/icons/vip-icon.png',
      features: ['Private showings', 'Priority access', 'Exclusive events', 'Complimentary maintenance'],
    },
    {
      title: 'Global Shipping',
      description: 'Safe and secure worldwide delivery with tracking and insurance for complete peace of mind.',
      icon: 'assets/icons/shipping-icon.png',
      features: ['Worldwide shipping', 'Package insurance', 'Express delivery', 'Doorstep service'],
    },
  ]);
  
  logSeedCompletion('Categories');
  return { categories, serviceCategories };
}
