import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards 
} from '@nestjs/common';
import { DiscountService } from '../services/discount.service';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import {
  ApiCreateDiscount,
  ApiFindAllDiscounts,
  ApiFindDiscountsByStock,
  ApiFindOneDiscount,
  ApiRemoveDiscount,
  ApiUpdateDiscount
} from '../swagger/discount-swagger.decorators';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiCreateDiscount()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @ApiFindAllDiscounts()
  findAll() {
    return this.discountService.findAll();
  }

  @Get('stock/:id')
  @ApiFindDiscountsByStock()
  findByStock(@Param('id') id: string) {
    return this.discountService.findByStock(id);
  }

  @Get(':id')
  @ApiFindOneDiscount()
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiUpdateDiscount()
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @Roles('admin')
  @ApiRemoveDiscount()
  remove(@Param('id') id: string) {
    return this.discountService.remove(id);
  }
}
