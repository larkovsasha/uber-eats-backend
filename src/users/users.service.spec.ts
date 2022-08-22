import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity, UserRoleEnum } from './entities/user.entity';
import { VerificationEntity } from './entities/verification.entity';
import { JwtService } from '../jwt/jwt.service';
import { Repository } from 'typeorm';
import exp from 'constants';
import { EditProfileInput } from './dtos/edit-profile.dto';

const mockRepository = () => ({
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(() => 'signed token'),
  verify: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let usersService: UsersService;
  let usersRepository: MockRepository<UserEntity>;
  let verificationsRepository: MockRepository<VerificationEntity>;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(VerificationEntity),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
    verificationsRepository = module.get(
      getRepositoryToken(VerificationEntity),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: UserRoleEnum.CLIENT,
    };

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'email',
      });
      const result = await usersService.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: '[App] There is a user with that email already!',
      });
    });

    it('should create new user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);
      verificationsRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      verificationsRepository.save.mockReturnValue({
        code: 'code',
      });

      const res = await usersService.createAccount(createAccountArgs);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(res).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error('ugly error'));
      const res = await usersService.createAccount(createAccountArgs);
      expect(res).toEqual({
        ok: false,
        error: "[App] Couldn't create account",
      });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'email',
      password: 'password',
    };
    const getMockedUser = (isPasswordCorrect: boolean) => ({
      id: 1,
      checkPassword: jest.fn(() => Promise.resolve(isPasswordCorrect)),
    });
    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);
      const res = await usersService.login(loginArgs);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
      expect(res).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if password is wrong', async () => {
      usersRepository.findOne.mockResolvedValue(getMockedUser(false));
      const res = await usersService.login(loginArgs);
      expect(res).toEqual({ ok: false, error: 'wrong password' });
    });

    it('should return token if password correct', async () => {
      usersRepository.findOne.mockResolvedValue(getMockedUser(true));
      const res = await usersService.login(loginArgs);

      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Object));
      expect(res).toEqual({ ok: true, token: 'signed token' });
    });
    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());

      const res = await usersService.login(loginArgs);
      expect(res).toEqual({
        ok: false,
        error: 'can log user in',
      });
    });
  });
  describe('findById', () => {
    it('should find and return existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue({ id: 1 });
      const result = await usersService.findById(1);
      expect(result).toEqual({
        ok: true,
        user: { id: 1 },
      });
    });
    it('should fail if user not found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await usersService.findById(1);
      expect(result).toEqual({ ok: false, error: 'User Not Found' });
    });
  });
  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        email: 'test@gmail.com',
        mailVerified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'testnew@gmail.com' },
      };

      const newVerification = {
        code: 'code',
      };

      const newUser = {
        mailVerified: false,
        email: editProfileArgs.input.email,
      };

      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationsRepository.create.mockReturnValue(newVerification);
      verificationsRepository.save.mockResolvedValue(newVerification);
      verificationsRepository.delete.mockResolvedValue(true);

      const res = await usersService.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: editProfileArgs.userId },
      });

      expect(verificationsRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(verificationsRepository.save).toHaveBeenCalledWith(
        newVerification,
      );

      expect(res).toEqual({
        ok: true,
      });
    });

    it('should change password', async () => {
      const editProfileArgs = {
        userId: 1,
        input: { password: 'newpassword1234' },
      };
      usersRepository.findOne.mockResolvedValue({ password: 'old' });
      const result = await usersService.editProfile(
        editProfileArgs.userId,
        editProfileArgs.input,
      );
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);

      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await usersService.editProfile(1, { email: '12' });

      expect(result).toEqual({
        ok: false,
        error: 'Could not update profile.',
      });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email', async () => {
      const mockedVerification = {
        user: {
          mailVerified: false,
        },
        id: 1,
      };
      verificationsRepository.findOne.mockResolvedValue(mockedVerification);

      const res = await usersService.verifyEmail('');

      expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
      );

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith({ mailVerified: true });

      expect(verificationsRepository.delete).toHaveBeenCalledTimes(1);
      expect(verificationsRepository.delete).toHaveBeenCalledWith(
        mockedVerification.id,
      );
      expect(res).toEqual({ ok: true });
    });
    it('should fail on verification not found', async () => {
      verificationsRepository.findOne.mockResolvedValue(undefined);
      const res = await usersService.verifyEmail('');
      expect(res).toEqual({ ok: false, error: 'Verification not found.' });
    });
    it('should fail on exception', async () => {
      verificationsRepository.findOne.mockRejectedValue(new Error());
      const res = await usersService.verifyEmail('');
      expect(res).toEqual({ ok: false, error: 'Could not verify email.' });
    });
  });
});
