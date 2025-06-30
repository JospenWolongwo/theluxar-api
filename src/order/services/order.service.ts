import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Generate a unique order number if not provided
    if (!createOrderDto.orderNumber) {
      createOrderDto.orderNumber = this.generateOrderNumber();
    }

    // Default values for optional fields
    const orderData = {
      ...createOrderDto,
      status: createOrderDto.status || OrderStatus.PENDING,
      discount: createOrderDto.discount || 0,
      tax: createOrderDto.tax || 0,
    };

    // Create the order without items first
    const order = this.orderRepository.create({
      userId: orderData.userId,
      orderNumber: orderData.orderNumber,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      tax: orderData.tax,
      total: orderData.total,
      status: orderData.status,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      deliveryMethod: orderData.deliveryMethod,
      trackingNumber: orderData.trackingNumber,
      notes: orderData.notes,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create and save order items
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      const orderItems = await Promise.all(
        createOrderDto.items.map(async (itemDto) => {
          // Get product data to store as snapshot
          // In a real application, you would fetch this from a product service
          // For now, we'll just use a simple representation
          const productData = {
            id: itemDto.productId,
            price: itemDto.price,
            // Additional product data would be fetched here
          };

          const total = itemDto.quantity * itemDto.price - (itemDto.discount || 0);

          const orderItem = this.orderItemRepository.create({
            orderId: savedOrder.id,
            productId: itemDto.productId,
            quantity: itemDto.quantity,
            price: itemDto.price,
            discount: itemDto.discount || 0,
            total: total,
            productData: productData,
          });

          return this.orderItemRepository.save(orderItem);
        })
      );

      savedOrder.items = orderItems;
    } else {
      savedOrder.items = [];
    }

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items'],
    });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { orderNumber },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Update the order fields if provided
    if (updateOrderDto.userId !== undefined) {
      order.userId = updateOrderDto.userId;
    }
    if (updateOrderDto.status !== undefined) {
      order.status = updateOrderDto.status;
    }
    if (updateOrderDto.subtotal !== undefined) {
      order.subtotal = updateOrderDto.subtotal;
    }
    if (updateOrderDto.discount !== undefined) {
      order.discount = updateOrderDto.discount;
    }
    if (updateOrderDto.tax !== undefined) {
      order.tax = updateOrderDto.tax;
    }
    if (updateOrderDto.total !== undefined) {
      order.total = updateOrderDto.total;
    }
    if (updateOrderDto.shippingAddress !== undefined) {
      order.shippingAddress = updateOrderDto.shippingAddress;
    }
    if (updateOrderDto.billingAddress !== undefined) {
      order.billingAddress = updateOrderDto.billingAddress;
    }
    if (updateOrderDto.paymentMethod !== undefined) {
      order.paymentMethod = updateOrderDto.paymentMethod;
    }
    if (updateOrderDto.deliveryMethod !== undefined) {
      order.deliveryMethod = updateOrderDto.deliveryMethod;
    }
    if (updateOrderDto.trackingNumber !== undefined) {
      order.trackingNumber = updateOrderDto.trackingNumber;
    }
    if (updateOrderDto.notes !== undefined) {
      order.notes = updateOrderDto.notes;
    }

    // We don't handle items update here for simplicity
    // In a real application, you would need to handle adding/removing/updating items

    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  // Helper method to generate a unique order number
  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `ORD-${year}${month}${day}-${random}`;
  }
}
