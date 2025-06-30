import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressType } from '../enums/address-type.enum';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    // If this is set as default, unset any existing default addresses of this type
    if (createAddressDto.isDefault) {
      await this.unsetDefaultAddress(createAddressDto.userId, createAddressDto.type);
    }

    const address = this.addressRepository.create(createAddressDto);
    return this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  async findByUser(userId: string): Promise<Address[]> {
    return this.addressRepository.find({
      where: { userId },
      order: {
        isDefault: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async findByUserAndType(userId: string, type: AddressType): Promise<Address[]> {
    return this.addressRepository.find({
      where: { userId, type },
      order: {
        isDefault: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);

    // If updating to be default, unset any existing default addresses of this type
    if (updateAddressDto.isDefault && !address.isDefault) {
      await this.unsetDefaultAddress(address.userId, address.type);
    }

    // Update the address fields
    Object.assign(address, updateAddressDto);

    return this.addressRepository.save(address);
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
  }

  async setAsDefault(id: string): Promise<Address> {
    const address = await this.findOne(id);
    
    // Unset any existing default addresses of this type
    await this.unsetDefaultAddress(address.userId, address.type);
    
    // Set this address as default
    address.isDefault = true;
    return this.addressRepository.save(address);
  }

  private async unsetDefaultAddress(userId: string, type: AddressType): Promise<void> {
    // Find current default address of this type
    const defaultAddress = await this.addressRepository.findOne({
      where: { userId, type, isDefault: true },
    });

    // If found, unset default status
    if (defaultAddress) {
      defaultAddress.isDefault = false;
      await this.addressRepository.save(defaultAddress);
    }
  }
}
