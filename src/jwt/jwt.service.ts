import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptionsInterface } from './jwt-module-options.interface';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { CONFIG_OPTIONS } from '../common/common.constants';

@Injectable()
export class JwtService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptionsInterface,
  ) {}

  sign(payload: object): string {
    return sign(payload, this.options.secretKey);
  }

  verify(token: string): JwtPayload | string {
    return verify(token, this.options.secretKey);
  }
}
