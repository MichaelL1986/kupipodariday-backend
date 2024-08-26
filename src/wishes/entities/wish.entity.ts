import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsPositive, IsString, IsUrl, Length } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(1, 250)
  name: string;
  @Column()
  @IsUrl()
  link: string;
  @Column()
  @IsUrl()
  image: string;
  @Column('numeric', {
    precision: 2,
  })
  @IsPositive()
  price: number;
  @Column('numeric', {
    precision: 2,
    default: '0',
  })
  @IsPositive()
  raised: number;
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;
  @ManyToOne(() => Offer, (offer) => offer.item)
  offers: Offer;
  @Column('int', { default: '0' })
  copied = 0;
}
