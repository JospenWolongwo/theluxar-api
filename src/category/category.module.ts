import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    CategoryService,
  ],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
