import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const owner = await this.usersService.findOne(userId);
    const wish = await this.wishesService.findOne(itemId);

    if (wish.owner !== owner) {
      throw new ForbiddenException('Операция запрещена');
    }

    const raised = wish.raised + amount;
    if (raised > wish.price) {
      throw new BadRequestException({
        message: 'Некорректное значение amount',
      });
    }
    wish.raised += amount;
    await this.wishesService.set(itemId, { raised });

    return this.offersRepository.save({
      ...createOfferDto,
      owner,
      amount,
      item: wish,
    });
  }

  findOne(id: number) {
    return this.offersRepository.findOneByOrFail({ id });
  }

  findAll() {
    return this.offersRepository.find();
  }
}
