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
import { ProductDescriptionService } from '../services/product-description.service';
import { CreateSpecItemDto, UpdateSpecItemDto } from '../dto/spec-item.dto';
import { CreateCoreFeatureDto, UpdateCoreFeatureDto } from '../dto/core-feature.dto';
import { CreateIncludedItemDto, UpdateIncludedItemDto } from '../dto/included-item.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SpecItem } from '../entities/spec-item.entity';
import { CoreFeature } from '../entities/core-feature.entity';
import { IncludedItem } from '../entities/included-item.entity';

@ApiTags('Product Description')
@Controller('product-description')
export class ProductDescriptionController {
  constructor(private readonly productDescriptionService: ProductDescriptionService) {}

  // Combined endpoint to get all product description data
  @Get('products/:productId')
  @ApiOperation({ summary: 'Get all description data for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all description data for the specified product',
  })
  async getProductDescriptionData(@Param('productId') productId: string) {
    return this.productDescriptionService.getProductDescriptionData(productId);
  }

  // SpecItem endpoints
  @Post('spec-items')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new spec item' })
  @ApiResponse({
    status: 201,
    description: 'The spec item has been successfully created',
    type: SpecItem,
  })
  createSpecItem(@Body() createSpecItemDto: CreateSpecItemDto) {
    return this.productDescriptionService.createSpecItem(createSpecItemDto);
  }

  @Get('products/:productId/spec-items')
  @ApiOperation({ summary: 'Get all spec items for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all spec items for the specified product',
    type: [SpecItem],
  })
  getSpecItemsByProduct(@Param('productId') productId: string) {
    return this.productDescriptionService.getSpecItemsByProductId(productId);
  }

  @Patch('spec-items/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a spec item' })
  @ApiParam({ name: 'id', description: 'Spec item ID' })
  @ApiResponse({
    status: 200,
    description: 'The spec item has been successfully updated',
    type: SpecItem,
  })
  updateSpecItem(
    @Param('id') id: string,
    @Body() updateSpecItemDto: UpdateSpecItemDto,
  ) {
    return this.productDescriptionService.updateSpecItem(id, updateSpecItemDto);
  }

  @Delete('spec-items/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a spec item' })
  @ApiParam({ name: 'id', description: 'Spec item ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The spec item has been successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSpecItem(@Param('id') id: string) {
    return this.productDescriptionService.removeSpecItem(id);
  }

  // CoreFeature endpoints
  @Post('core-features')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new core feature' })
  @ApiResponse({
    status: 201,
    description: 'The core feature has been successfully created',
    type: CoreFeature,
  })
  createCoreFeature(@Body() createCoreFeatureDto: CreateCoreFeatureDto) {
    return this.productDescriptionService.createCoreFeature(createCoreFeatureDto);
  }

  @Get('products/:productId/core-features')
  @ApiOperation({ summary: 'Get all core features for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all core features for the specified product',
    type: [CoreFeature],
  })
  getCoreFeaturesByProduct(@Param('productId') productId: string) {
    return this.productDescriptionService.getCoreFeaturesByProductId(productId);
  }

  @Patch('core-features/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a core feature' })
  @ApiParam({ name: 'id', description: 'Core feature ID' })
  @ApiResponse({
    status: 200,
    description: 'The core feature has been successfully updated',
    type: CoreFeature,
  })
  updateCoreFeature(
    @Param('id') id: string,
    @Body() updateCoreFeatureDto: UpdateCoreFeatureDto,
  ) {
    return this.productDescriptionService.updateCoreFeature(id, updateCoreFeatureDto);
  }

  @Delete('core-features/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a core feature' })
  @ApiParam({ name: 'id', description: 'Core feature ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The core feature has been successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCoreFeature(@Param('id') id: string) {
    return this.productDescriptionService.removeCoreFeature(id);
  }

  // IncludedItem endpoints
  @Post('included-items')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new included item' })
  @ApiResponse({
    status: 201,
    description: 'The included item has been successfully created',
    type: IncludedItem,
  })
  createIncludedItem(@Body() createIncludedItemDto: CreateIncludedItemDto) {
    return this.productDescriptionService.createIncludedItem(createIncludedItemDto);
  }

  @Get('products/:productId/included-items')
  @ApiOperation({ summary: 'Get all included items for a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns all included items for the specified product',
    type: [IncludedItem],
  })
  getIncludedItemsByProduct(@Param('productId') productId: string) {
    return this.productDescriptionService.getIncludedItemsByProductId(productId);
  }

  @Patch('included-items/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an included item' })
  @ApiParam({ name: 'id', description: 'Included item ID' })
  @ApiResponse({
    status: 200,
    description: 'The included item has been successfully updated',
    type: IncludedItem,
  })
  updateIncludedItem(
    @Param('id') id: string,
    @Body() updateIncludedItemDto: UpdateIncludedItemDto,
  ) {
    return this.productDescriptionService.updateIncludedItem(id, updateIncludedItemDto);
  }

  @Delete('included-items/:id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an included item' })
  @ApiParam({ name: 'id', description: 'Included item ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The included item has been successfully deleted',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeIncludedItem(@Param('id') id: string) {
    return this.productDescriptionService.removeIncludedItem(id);
  }
}
