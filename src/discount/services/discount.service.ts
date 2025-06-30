import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from '../entities/discount.entity';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    const discount = this.discountRepository.create(createDiscountDto);
    return this.discountRepository.save(discount);
  }

  async findAll(): Promise<Discount[]> {
    return this.discountRepository.find({
      relations: ['stock'],
    });
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['stock'],
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    return discount;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto): Promise<Discount> {
    const discount = await this.findOne(id);
    Object.assign(discount, updateDiscountDto);
    return this.discountRepository.save(discount);
  }

  async remove(id: string): Promise<void> {
    const discount = await this.findOne(id);
    await this.discountRepository.remove(discount);
  }

  async findByStock(stockId: string): Promise<Discount[]> {
    return this.discountRepository.find({
      where: { stockId },
    });
  }
}
