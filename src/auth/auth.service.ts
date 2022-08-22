import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as hash from 'object-hash';
import { PrismaService } from '../prisma/prisma.service';
import { UserHolidaysService } from '../user-holidays/user-holidays.service';
import { AuthDto } from './dto';

@Injectable()
class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userHolidays: UserHolidaysService,
  ) {}

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    if (hash(dto.password) !== user.hash) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.refreshTokens(user);
  }

  async signUp(dto: AuthDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash(dto.password),
        },
      });
      await this.userHolidays.create({
        userId: user.id,
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken.');
        }
      }
      throw error;
    }
  }

  async refreshTokens(user: User) {
    const tokens = await this.jwtSignTokens(user);
    await this.prisma.user.update({
      data: {
        refreshToken: tokens.refresh_token,
      },
      where: {
        id: user.id,
      },
    });

    return tokens;
  }

  async logout(user: User) {
    return this.prisma.user.update({
      data: {
        refreshToken: null,
      },
      where: {
        id: user.id,
      },
    });
  }

  private async jwtSignTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      sub: user.id,
    };

    const accessToken = await this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_SECRET_DURATION'),
      secret: this.config.get('JWT_SECRET_TOKEN'),
    });
    const refreshToken = await this.jwt.sign(payload, {
      expiresIn: this.config.get('JWT_REFRESH_DURATION'),
      secret: this.config.get('JWT_REFRESH_TOKEN'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

export { AuthService };
