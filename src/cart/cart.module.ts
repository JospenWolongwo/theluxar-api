import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    CartService,
  ],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
