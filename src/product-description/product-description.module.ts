import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SpecItem } from './entities/spec-item.entity';
import { CoreFeature } from './entities/core-feature.entity';
import { IncludedItem } from './entities/included-item.entity';
import { ProductDescriptionService } from './services/product-description.service';
import { ProductDescriptionController } from './controllers/product-description.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpecItem, CoreFeature, IncludedItem]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProductDescriptionController],
  providers: [ProductDescriptionService],
  exports: [ProductDescriptionService],
})
export class ProductDescriptionModule {}
