import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  ApiCreateProduct, 
  ApiFindAllProducts, 
  ApiFindOneProduct, 
  ApiRemoveProduct, 
  ApiSearchProducts, 
  ApiUpdateProduct 
} from '../swagger/product-swagger.decorators';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiCreateProduct()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiFindAllProducts()
  findAll() {
    return this.productService.findAll();
  }

  @Get('search')
  @ApiSearchProducts()
  search(@Query('q') query: string) {
    return this.productService.searchProducts(query);
  }

  @Get('category/:id')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Return products by category.' })
  findByCategory(@Param('id') id: string) {
    return this.productService.findByCategory(id);
  }

  @Get(':id')
  @ApiFindOneProduct()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiUpdateProduct()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiRemoveProduct()
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
