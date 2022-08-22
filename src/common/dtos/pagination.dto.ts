import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';

@InputType()
export class PaginationInput {
  @Field((type) => Number, { defaultValue: 1 })
  page = 1;

  @Field((type) => Number, { defaultValue: 10 })
  itemsInPage = 10;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field((type) => Number, { nullable: true })
  totalPages?: number;
  @Field((type) => Number, { nullable: true })
  totalItems?: number;
}
