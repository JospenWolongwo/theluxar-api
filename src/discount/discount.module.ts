import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { DiscountService } from './services/discount.service';
import { DiscountController } from './controllers/discount.controller';
import { Discount } from './entities/discount.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Discount]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    DiscountService,
  ],
  controllers: [DiscountController],
  exports: [DiscountService],
})
export class DiscountModule {}
