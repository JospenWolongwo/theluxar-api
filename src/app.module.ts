import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { databaseConfig, pinoConfig, redisConfig } from './common/config';
import { User } from './user/entities/user.entity';
import { Auth } from './auth/entities/auth.entity';
import { EmailModule } from './email/email.module';
import { UserPermissionsModule } from './user-permission/user-permission.module';

// Product related modules
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { StockModule } from './stock/stock.module';
import { DiscountModule } from './discount/discount.module';
import { ReviewModule } from './review/review.module';

// Shopping related modules
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';

// Supporting entity modules
import { ServiceCategoryModule } from './service-category/service-category.module';
import { ProductDescriptionModule } from './product-description/product-description.module';
import { ProductFilterModule } from './product-filter/product-filter.module';

// Product related entities
import { Product } from './product/entities/product.entity';
import { Category } from './category/entities/category.entity';
import { Stock } from './stock/entities/stock.entity';
import { Discount } from './discount/entities/discount.entity';
import { Review } from './review/entities/review.entity';

// Shopping related entities
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { Wishlist } from './wishlist/entities/wishlist.entity';
import { WishlistItem } from './wishlist/entities/wishlist-item.entity';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/order-item.entity';
import { Address } from './address/entities/address.entity';

// Supporting entities
import { ServiceCategory } from './service-category/entities/service-category.entity';
import { SpecItem } from './product-description/entities/spec-item.entity';
import { CoreFeature } from './product-description/entities/core-feature.entity';
import { IncludedItem } from './product-description/entities/included-item.entity';
import { FilterCategory } from './product-filter/entities/filter-category.entity';
import { FilterOption } from './product-filter/entities/filter-option.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...databaseConfig(),
      entities: [
        // Auth & User entities
        Auth, User,
        
        // Product related entities
        Product, Category, Stock, Discount, Review,
        
        // Shopping related entities
        Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, Address,
        
        // Supporting entities
        ServiceCategory, SpecItem, CoreFeature, IncludedItem,
        FilterCategory, FilterOption
      ],
    }),
    TypeOrmModule.forFeature([User, Auth]),
    CacheModule.registerAsync(redisConfig()),
    LoggerModule.forRoot(pinoConfig()),
    
    // Auth & User modules
    AuthModule,
    UserModule,
    EmailModule,
    UserPermissionsModule,
    
    // Product related modules
    ProductModule,
    CategoryModule,
    StockModule,
    DiscountModule,
    ReviewModule,
    
    // Shopping related modules
    CartModule,
    WishlistModule,
    OrderModule,
    AddressModule,
    
    // Supporting entity modules
    ServiceCategoryModule,
    ProductDescriptionModule,
    ProductFilterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
