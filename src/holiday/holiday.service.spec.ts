import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { HolidayService } from './holiday.service';

describe('HolidayService', () => {
  let service: HolidayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
        HolidayService,
        {
          provide: PrismaService,
          useValue: {
            create: jest.fn().mockReturnValue({}),
            delete: jest.fn().mockResolvedValue({}),
            findFirst: jest.fn().mockResolvedValue({}),
            findMany: jest.fn().mockResolvedValue([]),
            findUnique: jest.fn().mockResolvedValue({}),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<HolidayService>(HolidayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
