import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { UserEntity } from './user.entity';
import { v4 as uuid } from 'uuid';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'verification' })
export class VerificationEntity extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne((type) => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @BeforeInsert()
  async createCode(): Promise<void> {
    this.code = uuid();
  }
}
