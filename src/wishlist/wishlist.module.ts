import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { WishlistService } from './services/wishlist.service';
import { WishlistController } from './controllers/wishlist.controller';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, WishlistItem]),
    forwardRef(() => AuthModule),
  ],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
