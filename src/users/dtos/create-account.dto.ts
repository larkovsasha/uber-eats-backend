import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { UserEntity } from '../entities/user.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class CreateAccountInput extends PickType<
  UserEntity,
  'email' | 'password' | 'role'
>(UserEntity, ['email', 'password', 'role']) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
