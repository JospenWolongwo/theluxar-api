import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { Review } from './entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    ReviewService,
  ],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
