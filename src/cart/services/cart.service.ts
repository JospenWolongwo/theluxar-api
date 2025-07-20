import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartRepository.create(createCartDto);

    // Initialize empty items array if none provided
    if (!cart.items) {
      cart.items = [];
    }

    // Calculate totals
    this.calculateCartTotals(cart);

    return this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async findOne(id: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async findByUser(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      // Create a new cart for this user if one doesn't exist
      return this.create({ userId });
    }

    return cart;
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    Object.assign(cart, updateCartDto);

    // Calculate totals
    this.calculateCartTotals(cart);

    return this.cartRepository.save(cart);
  }

  async remove(id: string): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.remove(cart);
  }

  async addItemToCart(
    cartId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId);

    // Check if the item already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId === createCartItemDto.productId,
    );

    if (existingItem) {
      // Update the quantity of the existing item
      existingItem.quantity += createCartItemDto.quantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Create a new cart item
      const cartItem = this.cartItemRepository.create({
        ...createCartItemDto,
        cartId,
      });

      await this.cartItemRepository.save(cartItem);
      cart.items.push(cartItem);
    }

    // Calculate totals
    this.calculateCartTotals(cart);

    return this.cartRepository.save(cart);
  }

  async updateCartItem(
    cartId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.findOne(cartId);

    const cartItem = cart.items.find((item) => item.id === itemId);
    if (!cartItem) {
      throw new NotFoundException(
        `Cart item with ID ${itemId} not found in cart ${cartId}`,
      );
    }

    Object.assign(cartItem, updateCartItemDto);
    await this.cartItemRepository.save(cartItem);

    // Calculate totals
    this.calculateCartTotals(cart);

    return this.cartRepository.save(cart);
  }

  async removeCartItem(cartId: string, itemId: string): Promise<Cart> {
    const cart = await this.findOne(cartId);

    const itemIndex = cart.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new NotFoundException(
        `Cart item with ID ${itemId} not found in cart ${cartId}`,
      );
    }

    // Remove the item from the cart
    await this.cartItemRepository.remove(cart.items[itemIndex]);
    cart.items.splice(itemIndex, 1);

    // Calculate totals
    this.calculateCartTotals(cart);

    return this.cartRepository.save(cart);
  }

  async clearCart(cartId: string): Promise<Cart> {
    const cart = await this.findOne(cartId);

    // Remove all items from the cart
    await this.cartItemRepository.remove(cart.items);
    cart.items = [];

    // Reset totals
    cart.subtotal = 0;
    cart.discount = 0;
    cart.tax = 0;
    cart.total = 0;

    return this.cartRepository.save(cart);
  }

  private calculateCartTotals(cart: Cart): void {
    // Calculate subtotal
    cart.subtotal = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Calculate total discount
    cart.discount = cart.items.reduce((sum, item) => {
      return sum + (item.discount || 0) * item.quantity;
    }, 0);

    // Calculate tax (assuming a standard tax rate, could be configurable)
    const taxRate = 0.1; // 10% tax rate
    cart.tax = (cart.subtotal - cart.discount) * taxRate;

    // Calculate total
    cart.total = cart.subtotal - cart.discount + cart.tax;
  }
}
