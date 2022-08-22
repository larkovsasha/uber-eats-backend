import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from '../../common/entities/core.entity';
import { CategoryEntity } from './category.entity';
import { UserEntity } from '../../users/entities/user.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'restaurant' })
export class RestaurantEntity extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(4)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  bgImage: string;

  @Field((type) => UserEntity)
  @ManyToOne(
    (type) => UserEntity,
    (userEntity: UserEntity) => userEntity.restaurants,
    { onDelete: 'CASCADE' },
  )
  owner: UserEntity;

  @Field((type) => CategoryEntity, { nullable: true })
  @ManyToOne(
    (type) => CategoryEntity,
    (categoryEntity: CategoryEntity) => categoryEntity.restaurants,
    { nullable: true, onDelete: 'SET NULL' },
  )
  category: CategoryEntity;

  @RelationId((restaurant: RestaurantEntity) => restaurant.owner)
  ownerId: number;
}
