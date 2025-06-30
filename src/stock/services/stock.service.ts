import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { StockAvailabilityStatus } from '../types/stock-availability-status.enum';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    const stock = this.stockRepository.create(createStockDto);
    return this.stockRepository.save(stock);
  }

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find({
      relations: ['product', 'discounts', 'reviews'],
    });
  }

  async findOne(id: string): Promise<Stock> {
    const stock = await this.stockRepository.findOne({
      where: { id },
      relations: ['product', 'discounts', 'reviews'],
    });

    if (!stock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    return stock;
  }

  async update(id: string, updateStockDto: UpdateStockDto): Promise<Stock> {
    const stock = await this.findOne(id);
    Object.assign(stock, updateStockDto);
    return this.stockRepository.save(stock);
  }

  async remove(id: string): Promise<void> {
    const stock = await this.findOne(id);
    await this.stockRepository.remove(stock);
  }

  async findByProduct(productId: string): Promise<Stock[]> {
    return this.stockRepository.find({
      where: { productId },
      relations: ['discounts', 'reviews'],
    });
  }

  async updateQuantity(id: string, quantity: number): Promise<Stock> {
    const stock = await this.findOne(id);
    stock.quantity = quantity;
    
    // Update availability status based on quantity
    if (quantity <= 0) {
      stock.availabilityStatus = StockAvailabilityStatus.OUT_OF_STOCK;
      stock.isAvailable = false;
    } else if (quantity < 5) {
      stock.availabilityStatus = StockAvailabilityStatus.LOW_STOCK;
      stock.isAvailable = true;
    } else {
      stock.availabilityStatus = StockAvailabilityStatus.IN_STOCK;
      stock.isAvailable = true;
    }
    
    return this.stockRepository.save(stock);
  }
}
