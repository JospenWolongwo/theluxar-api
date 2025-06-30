import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { OrderStatus } from '../enums/order-status.enum';
import {
  ApiCreateOrder,
  ApiFindAllOrders,
  ApiFindOrdersByUser,
  ApiFindOneOrder,
  ApiFindOrderByNumber,
  ApiUpdateOrder,
  ApiUpdateOrderStatus,
  ApiRemoveOrder,
} from '../swagger/order-swagger.decorators';
import { AuthContext } from '../../auth/utils/auth.context';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiCreateOrder()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // If userId is not provided in the DTO, use the authenticated user's ID
    if (!createOrderDto.userId) {
      createOrderDto.userId = AuthContext.getUserId(req);
    }
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiFindAllOrders()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('my-orders')
  @UseGuards(AccessTokenGuard)
  @ApiFindOrdersByUser()
  findMyOrders(@Request() req) {
    const userId = AuthContext.getUserId(req);
    return this.orderService.findByUser(userId);
  }

  @Get('number/:orderNumber')
  @UseGuards(AccessTokenGuard)
  @ApiFindOrderByNumber()
  findByOrderNumber(@Param('orderNumber') orderNumber: string, @Request() req) {
    return this.orderService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiFindOneOrder()
  findOne(@Param('id') id: string, @Request() req) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiUpdateOrder()
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @ApiUpdateOrderStatus()
  updateStatus(
    @Param('id') id: string,
    @Query('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRemoveOrder()
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
