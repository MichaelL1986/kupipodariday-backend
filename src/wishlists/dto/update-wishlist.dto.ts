import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsArray, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  name: string;
  @IsUrl()
  image: string;
  @IsArray()
  itemsId: number[];
}
