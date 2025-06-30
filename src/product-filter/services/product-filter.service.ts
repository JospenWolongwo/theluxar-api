import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterCategory } from '../entities/filter-category.entity';
import { FilterOption } from '../entities/filter-option.entity';
import { CreateFilterCategoryDto, UpdateFilterCategoryDto } from '../dto/filter-category.dto';
import { CreateFilterOptionDto, UpdateFilterOptionDto } from '../dto/filter-option.dto';

@Injectable()
export class ProductFilterService {
  constructor(
    @InjectRepository(FilterCategory)
    private filterCategoryRepository: Repository<FilterCategory>,
    @InjectRepository(FilterOption)
    private filterOptionRepository: Repository<FilterOption>
  ) {}

  // FilterCategory methods
  async createFilterCategory(createDto: CreateFilterCategoryDto): Promise<FilterCategory> {
    // Extract options from the DTO to handle separately
    const { options, ...categoryData } = createDto;
    
    // Create and save the category first
    const filterCategory = this.filterCategoryRepository.create(categoryData as Partial<FilterCategory>);
    const savedCategory = await this.filterCategoryRepository.save(filterCategory);
    
    // Handle options if provided
    if (options && options.length > 0) {
      const optionPromises = options.map(optionDto => {
        const optionData = {
          ...optionDto,
          filterCategoryId: savedCategory.id,
          // Ensure required fields are present
          name: optionDto.name || 'Unnamed',
          value: optionDto.value || 'No value'
        };
        return this.createFilterOption(optionData);
      });
      await Promise.all(optionPromises);
      
      // Refresh the category with the options
      return this.getFilterCategoryById(savedCategory.id);
    }
    
    return savedCategory;
  }

  async getAllFilterCategories(): Promise<FilterCategory[]> {
    return this.filterCategoryRepository.find({
      relations: ['options'],
    });
  }

  async getFilterCategoryById(id: string): Promise<FilterCategory> {
    const filterCategory = await this.filterCategoryRepository.findOne({
      where: { id },
      relations: ['options'],
    });

    if (!filterCategory) {
      throw new NotFoundException(`FilterCategory with ID ${id} not found`);
    }

    return filterCategory;
  }

  async updateFilterCategory(id: string, updateDto: UpdateFilterCategoryDto): Promise<FilterCategory> {
    const filterCategory = await this.getFilterCategoryById(id);

    // Handle nested options if provided
    const { options, ...categoryData } = updateDto;
    
    // Update the category fields
    Object.assign(filterCategory, categoryData);
    
    // Save the category first
    const updatedCategory = await this.filterCategoryRepository.save(filterCategory);
    
    // If options are provided, handle them separately
    if (options) {
      // This is a simple implementation - in a real app, you might want to 
      // handle adding/removing/updating individual options more carefully
      for (const option of options) {
        if (option.id) {
          // Update existing option
          await this.updateFilterOption(option.id, option);
        } else {
          // Create new option
          const newOptionData = {
            ...option,
            filterCategoryId: updatedCategory.id,
            // Ensure required fields are present
            name: option.name || 'Unnamed',
            value: option.value || 'No value'
          };
          await this.createFilterOption(newOptionData as CreateFilterOptionDto);
        }
      }
      
      // Refresh the category with updated options
      return this.getFilterCategoryById(id);
    }
    
    return updatedCategory;
  }

  async removeFilterCategory(id: string): Promise<void> {
    const result = await this.filterCategoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`FilterCategory with ID ${id} not found`);
    }
  }

  // FilterOption methods
  async createFilterOption(data: CreateFilterOptionDto): Promise<FilterOption> {
    // Ensure required fields are present
    const dataWithDefaults = {
      ...data,
      name: data.name || 'Unnamed',
      value: data.value || 'No value'
    };
    
    const filterOption = this.filterOptionRepository.create(dataWithDefaults as Partial<FilterOption>);
    return this.filterOptionRepository.save(filterOption);
  }

  async getFilterOptionById(id: string): Promise<FilterOption> {
    const filterOption = await this.filterOptionRepository.findOne({
      where: { id },
      relations: ['filterCategory'],
    });

    if (!filterOption) {
      throw new NotFoundException(`FilterOption with ID ${id} not found`);
    }

    return filterOption;
  }

  async updateFilterOption(id: string, data: UpdateFilterOptionDto): Promise<FilterOption> {
    const filterOption = await this.getFilterOptionById(id);

    // Update the fields
    Object.assign(filterOption, data as Partial<FilterOption>);
    
    return this.filterOptionRepository.save(filterOption);
  }

  async removeFilterOption(id: string): Promise<void> {
    const result = await this.filterOptionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`FilterOption with ID ${id} not found`);
    }
  }
}
