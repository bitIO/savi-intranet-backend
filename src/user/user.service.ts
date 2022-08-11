import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      data: {
        ...dto,
      },
      select: {
        HolidayApproval: true,
        HolidayPerUser: true,
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
      where: {
        id: userId,
      },
    });

    return user;
  }

  async switchRole(userId: number, dto: EditUserDto) {
    if (!dto.role) {
      throw new BadRequestException('No roles to switch to');
    }

    return this.editUser(userId, dto);
  }
}
