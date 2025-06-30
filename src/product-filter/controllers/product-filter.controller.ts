import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductFilterService } from '../services/product-filter.service';
import { CreateFilterCategoryDto, UpdateFilterCategoryDto } from '../dto/filter-category.dto';
import { CreateFilterOptionDto, UpdateFilterOptionDto } from '../dto/filter-option.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { FilterCategory } from '../entities/filter-category.entity';
import { FilterOption } from '../entities/filter-option.entity';

@ApiTags('Product Filters')
@Controller('product-filters')
export class ProductFilterController {
  constructor(private readonly productFilterService: ProductFilterService) {}

  // FilterCategory endpoints
  @Post('categories')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new filter category' })
  @ApiResponse({
    status: 201,
    description: 'The filter category has been successfully created',
    type: FilterCategory,
  })
  createFilterCategory(@Body() createFilterCategoryDto: CreateFilterCategoryDto) {
    return this.productFilterService.createFilterCategory(createFilterCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all filter categories' })
  @ApiResponse({
    status: 200,
    description: 'Returns all filter categories with their options',
    type: [FilterCategory],
  })
  getAllFilterCategories() {
    return this.productFilterService.getAllFilterCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get a filter category by ID' })
  @ApiParam({ name: 'id', description: 'Filter category ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified filter category with its options',
    type: FilterCategory,
  })
  getFilterCategoryById(@Param('id') id: string) {
    return this.productFilterService.getFilterCategoryById(id);
  }

  @Patch('categories/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a filter category' })
  @ApiParam({ name: 'id', description: 'Filter category ID' })
  @ApiResponse({
    status: 200,
    description: 'The filter category has been successfully updated',
    type: FilterCategory,
  })
  updateFilterCategory(
    @Param('id') id: string,
    @Body() updateFilterCategoryDto: UpdateFilterCategoryDto,
  ) {
    return this.productFilterService.updateFilterCategory(id, updateFilterCategoryDto);
  }

  @Delete('categories/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a filter category' })
  @ApiParam({ name: 'id', description: 'Filter category ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The filter category has been successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFilterCategory(@Param('id') id: string) {
    return this.productFilterService.removeFilterCategory(id);
  }

  // FilterOption endpoints
  @Post('options')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new filter option' })
  @ApiResponse({
    status: 201,
    description: 'The filter option has been successfully created',
    type: FilterOption,
  })
  createFilterOption(@Body() createFilterOptionDto: CreateFilterOptionDto) {
    return this.productFilterService.createFilterOption(createFilterOptionDto);
  }

  @Get('options/:id')
  @ApiOperation({ summary: 'Get a filter option by ID' })
  @ApiParam({ name: 'id', description: 'Filter option ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified filter option',
    type: FilterOption,
  })
  getFilterOptionById(@Param('id') id: string) {
    return this.productFilterService.getFilterOptionById(id);
  }

  @Patch('options/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a filter option' })
  @ApiParam({ name: 'id', description: 'Filter option ID' })
  @ApiResponse({
    status: 200,
    description: 'The filter option has been successfully updated',
    type: FilterOption,
  })
  updateFilterOption(
    @Param('id') id: string,
    @Body() updateFilterOptionDto: UpdateFilterOptionDto,
  ) {
    return this.productFilterService.updateFilterOption(id, updateFilterOptionDto);
  }

  @Delete('options/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a filter option' })
  @ApiParam({ name: 'id', description: 'Filter option ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The filter option has been successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFilterOption(@Param('id') id: string) {
    return this.productFilterService.removeFilterOption(id);
  }
}
