import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlists.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ unique: true })
  @Length(10, 20)
  username: string;
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;
  @Column({ unique: true, select: false })
  @IsEmail()
  email: string;
  @Column({ select: false })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
