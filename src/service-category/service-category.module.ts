import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ServiceCategoryService } from './services/service-category.service';
import { ServiceCategoryController } from './controllers/service-category.controller';
import { ServiceCategory } from './entities/service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceCategory]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
