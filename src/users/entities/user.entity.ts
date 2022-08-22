import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { RestaurantEntity } from '../../restaurants/entities/restaurant.entity';

export enum UserRoleEnum {
  CLIENT = 'CLIENT',
  OWNER = 'OWNER',
  DELIVERY = 'DELIVERY',
}
registerEnumType(UserRoleEnum, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'user' })
export class UserEntity extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column({ select: false })
  @IsString()
  password: string;

  @Field((type) => UserRoleEnum)
  @Column({ type: 'enum', enum: UserRoleEnum })
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @Field((type) => Boolean)
  @Column({ default: false })
  mailVerified: boolean;

  @Field((type) => [RestaurantEntity])
  @OneToMany(
    (type) => RestaurantEntity,
    (restaurantEntity: RestaurantEntity) => restaurantEntity.owner,
  )
  restaurants: RestaurantEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
