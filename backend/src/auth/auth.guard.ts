import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.headers['x-user-id'];

    if (!userId || userId.trim() === '') {
      throw new UnauthorizedException('Missing or empty x-user-id header');
    }

    // Attach userId to request for later use
    request.userId = userId;
    return true;
  }
}



