import { Injectable } from '@nestjs/common';
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

  signUp(dto: AuthDto) {
    return {
      ...dto,
      msg: 'I am signed up',
    };
  }
}

export { AuthService };
