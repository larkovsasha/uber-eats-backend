import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { VerificationEntity } from '../entities/verification.entity';

@InputType()
export class VerifyEmailInput extends PickType<VerificationEntity, 'code'>(
  VerificationEntity,
  ['code'],
) {}

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}
