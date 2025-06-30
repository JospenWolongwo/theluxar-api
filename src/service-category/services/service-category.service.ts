import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from '../entities/service-category.entity';
import { CreateServiceCategoryDto } from '../dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from '../dto/update-service-category.dto';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoryRepository: Repository<ServiceCategory>
  ) {}

  async create(createServiceCategoryDto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const serviceCategory = this.serviceCategoryRepository.create(createServiceCategoryDto);
    return this.serviceCategoryRepository.save(serviceCategory);
  }

  async findAll(): Promise<ServiceCategory[]> {
    return this.serviceCategoryRepository.find();
  }

  async findOne(id: string): Promise<ServiceCategory> {
    const serviceCategory = await this.serviceCategoryRepository.findOne({
      where: { id },
    });

    if (!serviceCategory) {
      throw new NotFoundException(`Service Category with ID ${id} not found`);
    }

    return serviceCategory;
  }

  async update(id: string, updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<ServiceCategory> {
    const serviceCategory = await this.findOne(id);

    // Update fields from the DTO
    if (updateServiceCategoryDto.title !== undefined) {
      serviceCategory.title = updateServiceCategoryDto.title;
    }
    if (updateServiceCategoryDto.description !== undefined) {
      serviceCategory.description = updateServiceCategoryDto.description;
    }
    if (updateServiceCategoryDto.icon !== undefined) {
      serviceCategory.icon = updateServiceCategoryDto.icon;
    }
    if (updateServiceCategoryDto.features !== undefined) {
      serviceCategory.features = updateServiceCategoryDto.features;
    }

    return this.serviceCategoryRepository.save(serviceCategory);
  }

  async remove(id: string): Promise<void> {
    const result = await this.serviceCategoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Service Category with ID ${id} not found`);
    }
  }
}
