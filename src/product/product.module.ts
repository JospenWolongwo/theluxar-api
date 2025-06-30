import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    ProductService,
  ],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
