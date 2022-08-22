import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';

@InputType()
export class GetRestaurantsInput extends PaginationInput {}

@ObjectType()
export class GetRestaurantsOutput extends PaginationOutput {
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
}
