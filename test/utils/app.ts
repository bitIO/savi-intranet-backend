import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../../src/app.module';

let port = 4444;

async function initializeApplication(dbName) {
  port += 1;

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(ConfigService)
    .useValue({
      get: jest.fn((key: string) => {
        switch (key) {
          case 'DATABASE_URL':
            return `postgresql://test:test@localhost:5433/test?schema=${dbName}`;
          case 'JWT_SECRET_TOKEN':
            return 'super-secret-toke';
          case 'JWT_SECRET_DURATION':
            return '5m';
          case 'JWT_REFRESH_TOKEN':
            return 'super-refresh-toke';
          case 'JWT_REFRESH_DURATION':
            return '5m';
          default:
            return null;
        }
      }),
    })
    .compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.init();
  await app.listen(port);

  pactum.request.setBaseUrl(`http://localhost:${port}`);

  return app;
}

export { initializeApplication };
