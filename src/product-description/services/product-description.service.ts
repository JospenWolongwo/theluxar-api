import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecItem } from '../entities/spec-item.entity';
import { CoreFeature } from '../entities/core-feature.entity';
import { IncludedItem } from '../entities/included-item.entity';

@Injectable()
export class ProductDescriptionService {
  constructor(
    @InjectRepository(SpecItem)
    private specItemRepository: Repository<SpecItem>,
    @InjectRepository(CoreFeature)
    private coreFeatureRepository: Repository<CoreFeature>,
    @InjectRepository(IncludedItem)
    private includedItemRepository: Repository<IncludedItem>
  ) {}

  // SpecItem methods
  async createSpecItem(data: Partial<SpecItem>): Promise<SpecItem> {
    const specItem = this.specItemRepository.create(data);
    return this.specItemRepository.save(specItem);
  }

  async getSpecItemsByProductId(productId: string): Promise<SpecItem[]> {
    return this.specItemRepository.find({
      where: { productId },
    });
  }

  async updateSpecItem(id: string, data: Partial<SpecItem>): Promise<SpecItem> {
    const specItem = await this.specItemRepository.findOne({
      where: { id },
    });

    if (!specItem) {
      throw new NotFoundException(`SpecItem with ID ${id} not found`);
    }

    Object.assign(specItem, data);
    return this.specItemRepository.save(specItem);
  }

  async removeSpecItem(id: string): Promise<void> {
    const result = await this.specItemRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`SpecItem with ID ${id} not found`);
    }
  }

  // CoreFeature methods
  async createCoreFeature(data: Partial<CoreFeature>): Promise<CoreFeature> {
    const coreFeature = this.coreFeatureRepository.create(data);
    return this.coreFeatureRepository.save(coreFeature);
  }

  async getCoreFeaturesByProductId(productId: string): Promise<CoreFeature[]> {
    return this.coreFeatureRepository.find({
      where: { productId },
    });
  }

  async updateCoreFeature(id: string, data: Partial<CoreFeature>): Promise<CoreFeature> {
    const coreFeature = await this.coreFeatureRepository.findOne({
      where: { id },
    });

    if (!coreFeature) {
      throw new NotFoundException(`CoreFeature with ID ${id} not found`);
    }

    Object.assign(coreFeature, data);
    return this.coreFeatureRepository.save(coreFeature);
  }

  async removeCoreFeature(id: string): Promise<void> {
    const result = await this.coreFeatureRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`CoreFeature with ID ${id} not found`);
    }
  }

  // IncludedItem methods
  async createIncludedItem(data: Partial<IncludedItem>): Promise<IncludedItem> {
    const includedItem = this.includedItemRepository.create(data);
    return this.includedItemRepository.save(includedItem);
  }

  async getIncludedItemsByProductId(productId: string): Promise<IncludedItem[]> {
    return this.includedItemRepository.find({
      where: { productId },
    });
  }

  async updateIncludedItem(id: string, data: Partial<IncludedItem>): Promise<IncludedItem> {
    const includedItem = await this.includedItemRepository.findOne({
      where: { id },
    });

    if (!includedItem) {
      throw new NotFoundException(`IncludedItem with ID ${id} not found`);
    }

    Object.assign(includedItem, data);
    return this.includedItemRepository.save(includedItem);
  }

  async removeIncludedItem(id: string): Promise<void> {
    const result = await this.includedItemRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`IncludedItem with ID ${id} not found`);
    }
  }

  // Combined product description data retrieval
  async getProductDescriptionData(productId: string) {
    const [specItems, coreFeatures, includedItems] = await Promise.all([
      this.getSpecItemsByProductId(productId),
      this.getCoreFeaturesByProductId(productId),
      this.getIncludedItemsByProductId(productId),
    ]);

    return {
      specItems,
      coreFeatures,
      includedItems,
    };
  }
}
