import { CoreOutput } from '../../common/dtos/output.dto';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class LoginInput extends PickType<UserEntity, 'email' | 'password'>(
  UserEntity,
  ['email', 'password'],
) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}
