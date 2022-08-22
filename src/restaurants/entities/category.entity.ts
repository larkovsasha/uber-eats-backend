import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsString, Length } from 'class-validator';
import { RestaurantEntity } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity({ name: 'categories' })
export class CategoryEntity extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  @Length(4, 5)
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((type) => [RestaurantEntity])
  @OneToMany(
    (type) => RestaurantEntity,
    (restaurantEntity: RestaurantEntity) => restaurantEntity.category,
  )
  restaurants: RestaurantEntity[];
}
