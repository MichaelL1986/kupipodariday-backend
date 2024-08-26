import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, userId: number) {
    const owner = await this.usersService.findOne(userId);
    return this.wishlistRepository.save({ ...createWishlistDto, owner });
  }

  findOne(id: number) {
    return this.wishlistRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Операция запрещена');
    }
    return this.wishlistRepository.update({ id }, updateWishlistDto);
  }

  async remove(id: number, userId: number) {
    const wishList = await this.findOne(id);
    if (wishList.owner.id !== userId) {
      throw new ForbiddenException('Операция запрещена');
    }

    return this.wishlistRepository.remove(wishList);
  }
}
