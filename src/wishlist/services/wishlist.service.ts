import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { WishlistItem } from '../entities/wishlist-item.entity';
import { CreateWishlistDto } from '../dto/create-wishlist.dto';
import { UpdateWishlistDto } from '../dto/update-wishlist.dto';
import { CreateWishlistItemDto } from '../dto/create-wishlist-item.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private wishlistItemRepository: Repository<WishlistItem>
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    // Check if a wishlist already exists for this user
    const existingWishlist = await this.wishlistRepository.findOne({
      where: { userId: createWishlistDto.userId },
    });

    if (existingWishlist) {
      throw new ConflictException('User already has a wishlist');
    }

    // Create the wishlist without items first
    const wishlist = this.wishlistRepository.create({
      userId: createWishlistDto.userId,
    });

    const savedWishlist = await this.wishlistRepository.save(wishlist);

    // If items were provided, add them to the wishlist
    if (createWishlistDto.items && createWishlistDto.items.length > 0) {
      const items = createWishlistDto.items.map(item => 
        this.wishlistItemRepository.create({
          ...item,
          wishlistId: savedWishlist.id,
        })
      );

      savedWishlist.items = await this.wishlistItemRepository.save(items);
    } else {
      savedWishlist.items = [];
    }

    return savedWishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['items', 'items.product'],
    });
  }

  async findByUser(userId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist not found for user with ID ${userId}`);
    }

    return wishlist;
  }

  async findOne(id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }

    return wishlist;
  }

  async update(id: string, updateWishlistDto: UpdateWishlistDto): Promise<Wishlist> {
    const wishlist = await this.findOne(id);

    // Update only the fields that are provided
    if (updateWishlistDto.userId !== undefined) {
      wishlist.userId = updateWishlistDto.userId;
    }

    return this.wishlistRepository.save(wishlist);
  }

  async remove(id: string): Promise<void> {
    const result = await this.wishlistRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Wishlist with ID ${id} not found`);
    }
  }

  async addItemToWishlist(
    wishlistId: string,
    createWishlistItemDto: CreateWishlistItemDto
  ): Promise<WishlistItem> {
    const wishlist = await this.findOne(wishlistId);

    // Check if the item is already in the wishlist
    const existingItem = await this.wishlistItemRepository.findOne({
      where: {
        wishlistId,
        productId: createWishlistItemDto.productId,
      },
    });

    if (existingItem) {
      throw new ConflictException('This item is already in the wishlist');
    }

    // Create and save the new wishlist item
    const newItem = this.wishlistItemRepository.create({
      wishlistId,
      ...createWishlistItemDto,
    });

    return this.wishlistItemRepository.save(newItem);
  }

  async removeItemFromWishlist(
    wishlistId: string,
    itemId: string
  ): Promise<void> {
    await this.findOne(wishlistId);

    const result = await this.wishlistItemRepository.delete({
      id: itemId,
      wishlistId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Wishlist item with ID ${itemId} not found in wishlist ${wishlistId}`);
    }
  }

  async clearWishlist(wishlistId: string): Promise<void> {
    const wishlist = await this.findOne(wishlistId);

    await this.wishlistItemRepository.delete({ wishlistId });
  }

  async createForUserIfNotExists(userId: string): Promise<Wishlist> {
    try {
      return await this.findByUser(userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Create a new wishlist for the user
        return this.create({ userId, items: [] });
      }
      throw error;
    }
  }
}
