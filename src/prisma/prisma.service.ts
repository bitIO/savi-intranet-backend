import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://savi-intranet:s@v1-1ntr@n3t@localhost:5432/savi-intranet?schema=public',
        },
      },
    });
  }
}
