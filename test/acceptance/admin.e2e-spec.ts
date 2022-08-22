import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../../src/auth/dto';
import { EditUserDto } from '../../src/user/dto';
import { initializeApplication } from '../utils/app';
import { cleanDatabase } from '../utils/database';
import { createTestUsers, users } from '../utils/users';

describe('APP Acceptance - Admin', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeApplication('acceptance-admin');
    await cleanDatabase(app);
    await createTestUsers(app, 22);

    const credentials: AuthDto[] = users.map(({ email, password }) => {
      return {
        email,
        password,
      };
    });

    await pactum
      .spec()
      .post('/auth/signin')
      .withBody(credentials[0])
      .expectStatus(202)
      .stores('userAt', 'access_token');
    await pactum
      .spec()
      .post('/auth/signin')
      .withBody(credentials[1])
      .expectStatus(202)
      .stores('approveAt', 'access_token');
    await pactum
      .spec()
      .post('/auth/signin')
      .withBody(credentials[2])
      .expectStatus(202)
      .stores('adminAt', 'access_token');
  });

  afterAll(() => {
    app.close();
  });

  describe('Switch role', () => {
    it('should add admin role to user', () => {
      const editUserDto: EditUserDto = {
        role: ['USER', 'ADMIN'],
      };

      return pactum
        .spec()
        .patch('/users/1/roles')
        .withHeaders({
          Authorization: 'Bearer $S{adminAt}',
        })
        .withBody(editUserDto)
        .expectStatus(200)
        .expectBodyContains(editUserDto.role);
    });
  });
});
