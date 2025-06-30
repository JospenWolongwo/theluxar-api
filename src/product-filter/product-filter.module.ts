import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FilterCategory } from './entities/filter-category.entity';
import { FilterOption } from './entities/filter-option.entity';
import { ProductFilterService } from './services/product-filter.service';
import { ProductFilterController } from './controllers/product-filter.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilterCategory, FilterOption]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductFilterController],
  providers: [ProductFilterService],
  exports: [ProductFilterService],
})
export class ProductFilterModule {}
