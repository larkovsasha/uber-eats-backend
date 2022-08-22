import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { RestaurantEntity } from '../entities/restaurant.entity';
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto';

@InputType()
export class SearchRestaurantInput extends PaginationInput {
  @Field((type) => String)
  query: string;
}

@ObjectType()
export class SearchRestaurantOutput extends PaginationOutput {
  @Field((type) => [RestaurantEntity], { nullable: true })
  restaurants?: RestaurantEntity[];
}
