import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UserService } from '../../src/user/user.service';

const users = [
  {
    email: 'user@savispain.es',
    password: '1234',
  },
  {
    email: 'approve@savispain.es',
    password: '1234',
  },
  {
    email: 'admin@savispain.es',
    password: '1234',
  },
];

async function createTestUsers(
  app: INestApplication,
  remainingHolidays?: number,
) {
  const authService = await app.get(AuthService);
  const userService = await app.get(UserService);

  const dbUsers = await Promise.all(
    users.map((user) => {
      return authService.signUp({
        email: user.email,
        password: user.password,
      });
    }),
  );

  Promise.all(
    dbUsers.map((user) => {
      switch (user.email) {
        case 'admin@savispain.es':
          return userService.switchRole(user.id, {
            firstName: 'admin',
            role: ['USER', 'ADMIN'],
          });
        case 'approve@savispain.es':
          return userService.switchRole(user.id, {
            firstName: 'approve',
            role: ['USER', 'APPROVE'],
          });
        case 'user@savispain.es':
          return userService.switchRole(user.id, {
            firstName: 'user',
            role: ['USER'],
          });
        default:
          throw new Error('Unexpected email');
      }
    }),
  );

  if (remainingHolidays) {
    const prismaService = await app.get(PrismaService);
    Promise.all(
      dbUsers.map((user) => {
        return prismaService.userHolidays.update({
          data: {
            remaining: remainingHolidays,
          },
          where: {
            userId_year: {
              userId: user.id,
              year: new Date().getFullYear(),
            },
          },
        });
      }),
    );
  }
}

export { createTestUsers, users };
