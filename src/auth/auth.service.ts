import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as hash from 'object-hash';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
@Injectable()
class AuthService {
  constructor(private prisma: PrismaService) {}
  signIn() {
    return {
      msg: 'I am signed in',
    };
  }

  async signUp(dto: AuthDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash(dto.password),
        },
      });

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken.');
        }
        throw error;
      }
    }
  }
}

export { AuthService };
