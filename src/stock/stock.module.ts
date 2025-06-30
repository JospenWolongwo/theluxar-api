import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

import { StockService } from './services/stock.service';
import { StockController } from './controllers/stock.controller';
import { Stock } from './entities/stock.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stock]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    StockService,
  ],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
