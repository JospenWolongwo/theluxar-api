import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { AuthModule } from '../../auth/auth.module';
import { UserModule } from '../../user/user.module';
import { ProductModule } from '../../product/product.module';
import { CategoryModule } from '../../category/category.module';
import { StockModule } from '../../stock/stock.module';
import { DiscountModule } from '../../discount/discount.module';
import { ReviewModule } from '../../review/review.module';
import { CartModule } from '../../cart/cart.module';
import { WishlistModule } from '../../wishlist/wishlist.module';
import { OrderModule } from '../../order/order.module';
import { AddressModule } from '../../address/address.module';
import { ServiceCategoryModule } from '../../service-category/service-category.module';
import { ProductDescriptionModule } from '../../product-description/product-description.module';
import { ProductFilterModule } from '../../product-filter/product-filter.module';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('TheLuxar API')
  .setDescription('API documentation for the TheLuxar e-commerce platform')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  include: [
    AuthModule, 
    UserModule,
    ProductModule,
    CategoryModule,
    StockModule,
    DiscountModule,
    ReviewModule,
    CartModule,
    WishlistModule,
    OrderModule,
    AddressModule,
    ServiceCategoryModule,
    ProductDescriptionModule,
    ProductFilterModule
  ],
  deepScanRoutes: true,
};
