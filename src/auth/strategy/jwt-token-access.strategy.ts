import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET_TOKEN'),
    });
  }

  async validate(payload: {
    email: string;
    exp: number;
    iat: number;
    sub: number;
  }) {
    const user = this.prisma.user.findUnique({
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
}

export { JwtAccessStrategy };
