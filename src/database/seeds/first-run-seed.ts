import { config } from 'dotenv';
import { initDb } from './utils';
import { seedUsers } from './user.seed';
import { seedCategories } from './category.seed';
import { seedProducts } from './product.seed';
import {
  seedAddresses,
  seedCarts,
  seedWishlists,
  seedOrders,
} from './shopping.seed';

// Load environment variables
config();

/**
 * Seeds the database on first run without clearing existing data
 * Used for Render deployment with Neon DB
 */
export async function firstRunSeed() {
  console.log('🚀 Starting first-run database seeding...');
  
  // Declare db variable at function scope
  let db;

  try {
    // Initialize the database connection
    db = await initDb();

    // Check if there's existing data in the users table to avoid duplicate seeding
    const userRepo = db.getRepository('User');
    const existingUsersCount = await userRepo.count();

    if (existingUsersCount > 0) {
      console.log(
        '⏭️ Database already contains users, skipping first-run seeding',
      );
      await db.destroy();
      return;
    }

    console.log('🌱 Populating database with initial data...');

    // Seed users first (they're referenced by other entities)
    const users = await seedUsers(db);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed categories
    const { categories, serviceCategories } = await seedCategories(db);
    console.log(
      `✅ Seeded ${categories.length} categories and ${serviceCategories.length} service categories`,
    );

    // Seed products with their related entities
    const { products, stocks, reviews } = await seedProducts(db, categories);
    console.log(
      `✅ Seeded ${products.length} products, ${stocks.length} stock items, and ${reviews.length} reviews`,
    );

    // Seed shopping-related entities
    const addresses = await seedAddresses(db, users);
    console.log(`✅ Seeded ${addresses.length} addresses`);

    await seedCarts(db, users, products);
    console.log('✅ Seeded shopping carts');

    await seedWishlists(db, users, products);
    console.log('✅ Seeded wishlists');

    await seedOrders(db, users, products, addresses);
    console.log('✅ Seeded orders');

    console.log('✅ First-run database seeding completed successfully!');

    // Set environment variable to indicate first run is complete
    process.env.FIRST_RUN_COMPLETE = 'true';
  } catch (error) {
    console.error('❌ Error during first-run seeding:', error);
  } finally {
    // Close the database connection
    try {
      if (db) await db.destroy();
    } catch (err) {
      console.error('Error closing database connection:', err);
    }
  }
}

// Run firstRunSeed if this file is run directly
if (require.main === module) {
  firstRunSeed()
    .then(() => {
      console.log('First-run seed script execution complete');
      process.exit(0);
    })
    .catch((err) => {
      console.error('First-run seed script failed:', err);
      process.exit(1);
    });
}
