import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

const selectOptions: FindManyOptions<Wish> = {
  select: {
    id: true,
    createdAt: true,
    updatedAt: true,
    name: true,
    link: true,
    image: true,
    price: true,
    raised: true,
    copied: true,
    description: true,
    owner: {
      avatar: true,
      about: true,
      username: true,
    },
  },
  relations: ['owner'],
};

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}
  async create(createWishDto: CreateWishDto, userId: number) {
    const owner = await this.usersService.findOne(userId);
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner,
    });
    return this.wishesRepository.save(wish);
  }

  getLastWishes() {
    this.wishesRepository.find({
      ...selectOptions,
      order: { createdAt: 'DESC' },
      take: 30,
    });
  }

  getTopWishes() {
    this.wishesRepository.find({
      ...selectOptions,
      order: { copied: 'DESC' },
      take: 10,
    });
  }

  async copy(wishId: number, userId: number) {
    const owner = await this.usersService.findOne(userId);
    const sourceWish = await this.findOne(wishId);

    const { copied, id: _, ...wishData } = sourceWish;
    sourceWish.copied = copied + 1;
    await this.wishesRepository.save(sourceWish);
    return this.create(wishData, owner.id);
  }

  findAll() {
    return this.wishesRepository.find();
  }

  findOne(id: number) {
    return this.wishesRepository.findOneBy({ id });
  }

  findOneQuery(query: FindOneOptions<Wish>) {
    return this.wishesRepository.findOneOrFail(query);
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const { price } = updateWishDto;
    const wish = await this.findOne(id);
    if (wish.raised > 0 && price !== undefined) {
      throw new ConflictException();
    }
    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOneQuery({
      where: { id },
      relations: ['owner'],
    });
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Операция запрещена');
    }
    return this.wishesRepository.remove(wish);
  }

  set(id: number, value: any) {
    return this.wishesRepository.update({ id }, value);
  }
}
