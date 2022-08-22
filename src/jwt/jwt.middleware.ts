import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { JwtService } from './jwt.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if ('x-jwt' in req.headers) {
      const token: string = req.headers['x-jwt'].toString();
      try {
        const decoded = this.jwtService.verify(token);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const result = await this.userService.findById(decoded.id);
          req['user'] = result.user;
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}
