import { AuthGuard } from '@nestjs/passport';

class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}

export { JwtRefreshGuard };
