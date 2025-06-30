import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { StockService } from '../services/stock.service';
import { CreateStockDto } from '../dto/create-stock.dto';
import { UpdateStockDto } from '../dto/update-stock.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import {
  ApiCreateStock,
  ApiFindAllStocks,
  ApiFindOneStock,
  ApiFindStocksByProduct,
  ApiRemoveStock,
  ApiUpdateStock
} from '../swagger/stock-swagger.decorators';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiCreateStock()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiFindAllStocks()
  findAll() {
    return this.stockService.findAll();
  }

  @Get('product/:id')
  @ApiFindStocksByProduct()
  findByProduct(@Param('id') id: string) {
    return this.stockService.findByProduct(id);
  }

  @Get(':id')
  @ApiFindOneStock()
  findOne(@Param('id') id: string) {
    return this.stockService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiUpdateStock()
  update(@Param('id') id: string, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(id, updateStockDto);
  }

  @Patch(':id/quantity')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update stock quantity' })
  @ApiQuery({ name: 'quantity', required: true, description: 'New quantity value' })
  @ApiResponse({ status: 200, description: 'The stock quantity has been successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Stock item not found.' })
  updateQuantity(@Param('id') id: string, @Query('quantity') quantity: number) {
    return this.stockService.updateQuantity(id, quantity);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiRemoveStock()
  remove(@Param('id') id: string) {
    return this.stockService.remove(id);
  }
}
