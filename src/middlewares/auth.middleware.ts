import { Inject, Injectable, HttpStatus, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../../src/users/user.repository';
import { ApiError } from '../../src/filter/api.error';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  @Inject()
  private readonly userRepository: UserRepository;

  @Inject()
  private readonly config: ConfigService;

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1];
      try {
        const decoded: any = jwt.verify(token, this.config.get('jwtSecretKey'));

        const user = await this.userRepository.findOne({
          email: decoded.email,
        });
        if (!user) {
          throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
        }
        req['user'] = user;

        next();

        res.on('finish', () => {});
      } catch (error) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
      }
    } else {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }
  }
}
