import { CanActivate, createParamDecorator, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}
