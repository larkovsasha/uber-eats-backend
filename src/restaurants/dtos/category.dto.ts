import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CategoryEntity } from '../entities/category.entity';
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field((type) => String)
  slug: string;
}

@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
  @Field((type) => CategoryEntity, { nullable: true })
  category?: CategoryEntity;
}
