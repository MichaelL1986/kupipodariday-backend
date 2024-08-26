import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { LocalGuard } from 'src/guards/local.guard';

@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @UseGuards(LocalGuard)
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(createWishlistDto, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(LocalGuard)
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.wishlistsService.update(
      +id,
      updateWishlistDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @UseGuards(LocalGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.wishlistsService.remove(+id, req.user.userId);
  }
}
