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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { LocalGuard } from 'src/guards/local.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user.userId);
  }

  @Get('last')
  getLastWish() {
    return this.wishesService.getLastWishes();
  }

  @Get('top')
  getTopWish() {
    return this.wishesService.getTopWishes();
  }

  @Get(':id')
  @UseGuards(LocalGuard)
  findOne(@Param('id') id: string) {
    return this.wishesService.findOneQuery({
      where: { id: +id },
      relations: ['owner', 'offers'],
    });
  }

  @Patch(':id')
  @UseGuards(LocalGuard)
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(LocalGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.wishesService.remove(+id, req.user.userId);
  }

  @Post(':id/copy')
  @UseGuards(LocalGuard)
  copyWish(@Param('id') id: string, @Req() req) {
    return this.wishesService.copy(+id, req.user.userId);
  }
}
