import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// Auth & User entities
import { Auth } from '../../auth/entities/auth.entity';
import { User } from '../../user/entities/user.entity';
import { UserPermissionEntity } from '../../user-permission/entities/user-permission.entity';

// Product related entities
import { Product } from '../../product/entities/product.entity';
import { Category } from '../../category/entities/category.entity';
import { Stock } from '../../stock/entities/stock.entity';
import { Discount } from '../../discount/entities/discount.entity';
import { Review } from '../../review/entities/review.entity';

// Shopping related entities
import { Cart } from '../../cart/entities/cart.entity';
import { CartItem } from '../../cart/entities/cart-item.entity';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { WishlistItem } from '../../wishlist/entities/wishlist-item.entity';
import { Order } from '../../order/entities/order.entity';
import { OrderItem } from '../../order/entities/order-item.entity';
import { Address } from '../../address/entities/address.entity';

// Supporting entities
import { ServiceCategory } from '../../service-category/entities/service-category.entity';
import { SpecItem } from '../../product-description/entities/spec-item.entity';
import { CoreFeature } from '../../product-description/entities/core-feature.entity';
import { IncludedItem } from '../../product-description/entities/included-item.entity';
import { FilterCategory } from '../../product-filter/entities/filter-category.entity';
import { FilterOption } from '../../product-filter/entities/filter-option.entity';
// Load environment variables
config();

// Create database config
let dbConfig: DataSourceOptions;

// If DATABASE_URL is provided (e.g., Neon connection string), use it directly
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL for seed database connection');
  dbConfig = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  };
} else {
  console.log('Using individual database parameters for seed connection');
  dbConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'default_user',
    password: process.env.DB_PASSWORD || 'default_password',
    database: process.env.DB_NAME || 'theluxar',
    synchronize: true,
  };
}
  entities: [
    // Auth & User entities
    Auth, User, UserPermissionEntity,
    
    // Product related entities
    Product, Category, Stock, Discount, Review,
    
    // Shopping related entities
    Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Address,
    
    // Supporting entities
    ServiceCategory, SpecItem, CoreFeature, IncludedItem,
    FilterCategory, FilterOption
  ],
};

// Create a new data source
export const AppDataSource = new DataSource(dbConfig);
