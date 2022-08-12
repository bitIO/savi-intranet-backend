import { AuthGuard } from '@nestjs/passport';

class JwtAccessGuard extends AuthGuard(['jwt-access', 'jwt-refresh']) {
  constructor() {
    super();
  }
}

export { JwtAccessGuard };
