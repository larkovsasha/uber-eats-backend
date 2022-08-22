import { JwtService } from './jwt.service';
import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from '../common/common.constants';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => 'testKey'),
    verify: jest.fn(() => ({ id: USER_ID })),
  };
});

const TEST_KEY = 'testKey';
const USER_ID = 1;

describe('Jwt Service', () => {
  let jwtService: JwtService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: CONFIG_OPTIONS,
          useValue: { secretKey: TEST_KEY },
        },
      ],
    }).compile();
    jwtService = module.get<JwtService>(JwtService);
  });
  it('should be defined', async () => {
    expect(jwtService).toBeDefined();
  });

  describe('sign', () => {
    it('should return a signed token', async () => {
      const token = jwtService.sign({ id: USER_ID });
      expect(typeof token).toBe('string');
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith({ id: USER_ID }, TEST_KEY);
    });
  });
  describe('verify', () => {
    it('should return the decoded token', async () => {
      const TOKEN = 'TOKEN';
      const decodedToken = jwtService.verify(TOKEN);
      expect(decodedToken).toEqual({ id: USER_ID });
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY);
    });
  });
});
