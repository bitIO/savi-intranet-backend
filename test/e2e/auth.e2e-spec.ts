import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../../src/auth/dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { initializeApplication } from '../utils/app';
import { cleanDatabase } from '../utils/database';
import { users } from '../utils/users';

describe('APP E2E - Auth', () => {
  const dto: AuthDto[] = users.map(({ email, password }) => {
    return {
      email,
      password,
    };
  });

  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeApplication('auth');
    await cleanDatabase(app);
  });

  afterAll(() => {
    app.close();
  });

  describe('Create test users', () => {
    it('should throw if email empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          password: 'password',
        })
        .expectStatus(400);
    });

    it('should throw if password empty', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          email: 'test@test.com',
        })
        .expectStatus(400);
    });

    it('should throw if no body provided', () => {
      return pactum.spec().post('/auth/signup').expectStatus(400);
    });

    it('should create test user', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto[0])
        .expectStatus(201);
    });

    it('should create approve user', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto[1])
        .expectStatus(201);
    });

    it('should create admin user', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody(dto[2])
        .expectStatus(201);
    });
  });

  describe('Sign in users', () => {
    beforeAll(async () => {
      await app.get(PrismaService).user.update({
        data: {
          firstName: 'Approve',
          lastName: 'Savi',
          role: ['USER', 'APPROVE'],
        },
        where: {
          email: dto[1].email,
        },
      });
      await app.get(PrismaService).user.update({
        data: {
          email: 'admin@savispain.es',
          firstName: 'Admin',
          lastName: 'Savi',
          role: ['USER', 'ADMIN'],
        },
        where: {
          email: dto[2].email,
        },
      });
    });

    it('should throw if email empty', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          password: 'password',
        })
        .expectStatus(400);
    });

    it('should throw if password empty', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody({
          email: 'email@email.es',
        })
        .expectStatus(400);
    });

    it('should throw if no body provided', () => {
      return pactum.spec().post('/auth/signin').expectStatus(400);
    });

    it('should sign in user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto[0])
        .expectStatus(202)
        .stores('userAt', 'access_token');
    });

    it('should sign in approve user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto[1])
        .expectStatus(202)
        .stores('approveUserAt', 'access_token');
    });

    it('should sign in admin user', () => {
      return pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto[2])
        .expectStatus(202)
        .stores('adminUserAt', 'access_token');
    });
  });

  describe('Sign out users', () => {
    it('should sign out user', () => {
      return pactum
        .spec()
        .post('/auth/signout')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(201);
    });
    it('should sign out approve user', () => {
      return pactum
        .spec()
        .post('/auth/signout')
        .withHeaders({
          Authorization: 'Bearer $S{approveUserAt}',
        })
        .expectStatus(201);
    });
    it('should sign out admin user', () => {
      return pactum
        .spec()
        .post('/auth/signout')
        .withHeaders({
          Authorization: 'Bearer $S{adminUserAt}',
        })
        .expectStatus(201);
    });
  });

  describe('Refresh token', () => {
    it('should refresh token', async () => {
      await pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto[0])
        .expectStatus(202)
        .stores('userRt', 'refresh_token');

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { accessToken, refreshToken } = await pactum
        .spec()
        .post('/auth/refresh')
        .withHeaders({
          Authorization: 'Bearer $S{userRt}',
        })
        .expectStatus(201)
        .returns<{ accessToken: string; refreshToken: string }>('#tokens');
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(accessToken !== refreshToken).toBeTruthy();
    });
  });
});
