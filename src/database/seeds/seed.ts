import { config } from 'dotenv';
import { initDb } from './utils';
import { cleanUsers, seedUsers } from './user.seed';
import { cleanCategories, seedCategories } from './category.seed';
import { cleanProducts, seedProducts } from './product.seed';
import { 
  cleanShopping, 
  seedAddresses, 
  seedCarts, 
  seedWishlists, 
  seedOrders
} from './shopping.seed';

// Load environment variables
config();

/**
 * Cleans all data from database
 */
async function clean() {
  console.log('🧹 Starting database cleanup...');
  
  try {
    // Initialize the data source
    const db = await initDb();
    
    // Clean all entities in reverse order of dependencies
    await cleanShopping(db);
    await cleanProducts(db);
    await cleanCategories(db);
    await cleanUsers(db);
    
    console.log('✅ Database cleanup completed successfully!');
    return db;
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

/**
 * Seeds database with fresh data
 * @param db Database connection
 */
async function seed(db) {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Seed users first (they're referenced by other entities)
    const users = await seedUsers(db);
    
    // Seed categories
    const { categories, serviceCategories } = await seedCategories(db);
    
    // Seed products with their related entities
    const { products, stocks, reviews } = await seedProducts(db, categories);
    
    // Seed shopping-related entities
    const addresses = await seedAddresses(db, users);
    await seedCarts(db, users, products);
    await seedWishlists(db, users, products);
    await seedOrders(db, users, products, addresses);
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

/**
 * Main bootstrap function to reset and seed the database
 */
export async function bootstrap() {
  try {
    console.log('🚀 Starting database reset and seed process...');
    
    // Clean the database first
    const db = await clean();
    
    // Add a small delay to ensure the clean operation is fully complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Seed the database
    await seed(db);
    
    console.log('✅ Database reset and seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Bootstrap failed:', error);
    process.exit(1);
  }
}

// Run bootstrap if this file is run directly
if (require.main === module) {
  bootstrap();
}
