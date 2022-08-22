import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { JwtService } from '../jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerificationEntity } from './entities/verification.entity';
import { UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(VerificationEntity)
    private readonly verificationRepository: Repository<VerificationEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const userExists = await this.usersRepository.findOne({
        where: { email: createAccountInput.email },
      });

      if (userExists) {
        return {
          ok: false,
          error: '[App] There is a user with that email already!',
        };
      }

      const user = await this.usersRepository.save(
        this.usersRepository.create(createAccountInput),
      );
      await this.verificationRepository.save(
        this.verificationRepository.create({
          user,
        }),
      );

      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, error: "[App] Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.usersRepository.findOne({
        where: { email },
        select: ['password', 'id'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) return { ok: false, error: 'wrong password' };

      const token = this.jwtService.sign({ id: user.id });
      return { ok: true, token };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'can log user in' };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.usersRepository.findOneOrFail({ where: { id } });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'User Not Found' };
    }
  }

  async editProfile(
    userId,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (email) {
        user.email = email;
        user.mailVerified = false;

        await this.verificationRepository.delete({ user: { id: user.id } });
        const verification = this.verificationRepository.save(
          this.verificationRepository.create({
            user,
          }),
        );
      }
      if (password) {
        user.password = password;
      }
      await this.usersRepository.save(user);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verificationRepository.findOne({
        where: { code },
        relations: ['user'],
      });
      if (verification) {
        verification.user.mailVerified = true;
        await this.usersRepository.save(verification.user);
        await this.verificationRepository.delete(verification.id);
        return { ok: true };
      }
      return { ok: false, error: 'Verification not found.' };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'Could not verify email.' };
    }
  }
}
