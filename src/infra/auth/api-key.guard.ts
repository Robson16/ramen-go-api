import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public';
import { EnvService } from '../env/env.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private apiKey: string;

  constructor(
    private reflector: Reflector,
    env: EnvService,
  ) {
    this.apiKey = env.get('API_KEY');
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // Assumindo que a chave de API está no header 'x-api-key'

    if (apiKey === this.apiKey) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid API Key');
    }
  }
}
