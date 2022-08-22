import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

async function cleanDatabase(app: INestApplication) {
  await app.get(PrismaService).holidayRequestsValidations.deleteMany();
  await app.get(PrismaService).holidayRequestsComments.deleteMany();
  await app.get(PrismaService).holidayRequests.deleteMany();
  await app.get(PrismaService).userHolidays.deleteMany();
  await app.get(PrismaService).user.deleteMany();
}

export { cleanDatabase };
