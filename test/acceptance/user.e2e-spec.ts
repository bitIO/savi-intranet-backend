import { INestApplication } from '@nestjs/common';
import { Role } from '@prisma/client';
import { addBusinessDays } from 'date-fns';
import * as pactum from 'pactum';
import { AuthDto } from '../../src/auth/dto';
import {
  CommentHolidayRequestDto,
  CreateHolidayDto,
} from '../../src/holiday/dto';
import { EditUserDto } from '../../src/user/dto';
import { initializeApplication } from '../utils/app';
import { cleanDatabase } from '../utils/database';
import { createTestUsers, users } from '../utils/users';

describe('APP Acceptance - User', () => {
  let app: INestApplication;
  let dbUsers: { email: string; id: number }[];

  function getIdForRole(role: Role) {
    switch (role) {
      case 'ADMIN':
        return dbUsers.find((user) => {
          return user.email.startsWith('admin');
        }).id;
      case 'APPROVE':
        return dbUsers.find((user) => {
          return user.email.startsWith('approve');
        }).id;
      case 'USER':
        return dbUsers.find((user) => {
          return user.email.startsWith('user');
        }).id;
      default:
        throw new Error('invalid role');
    }
  }

  beforeAll(async () => {
    app = await initializeApplication('acceptance-user');
    await cleanDatabase(app);
    dbUsers = await createTestUsers(app, 22);

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

  it('should get current user', () => {
    return pactum
      .spec()
      .get('/users/me')
      .withHeaders({
        Authorization: 'Bearer $S{userAt}',
      })
      .expectJsonLength('role', 1)
      .expectJson('role', ['USER'])
      .expectStatus(200);
  });

  describe('Create Holiday Request', () => {
    const start = new Date();
    const end = addBusinessDays(start, 7);

    const createHolidayDto: CreateHolidayDto = {
      end,
      start,
    };

    it('should fail for exceed quota request', () => {
      return pactum
        .spec()
        .post('/holidays')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody({
          end: addBusinessDays(new Date(), 40),
          start: new Date(),
        })
        .expectStatus(409)
        .expectBodyContains('Quota exceeded');
    });

    it('should create a holiday request', () => {
      return pactum
        .spec()
        .post('/holidays')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(createHolidayDto)
        .expectStatus(201)
        .expectBodyContains(createHolidayDto.start)
        .expectBodyContains(createHolidayDto.end);
    });

    it('should fail for the same holiday request', () => {
      return pactum
        .spec()
        .post('/holidays')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(createHolidayDto)
        .expectStatus(409)
        .expectBodyContains('Request already created');
    });

    it('should comment on request', () => {
      const commentHolidayDto: CommentHolidayRequestDto = {
        comment: 'user comment',
        holidayRequestId: 1,
        userId: 1,
      };
      pactum
        .spec()
        .post('/holidays/1/comments')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(commentHolidayDto)
        .expectStatus(201)
        .expectBody(commentHolidayDto.comment);
    });
  });

  describe('Get holidays request', () => {
    it('should retrieve my holiday requests', () => {
      return pactum
        .spec()
        .get(`/holidays/users/${getIdForRole('USER')}`)
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('should fail retrieving others holiday requests', () => {
      return pactum
        .spec()
        .get('/holidays/users/20')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(403)
        .expectBodyContains('Access to resource denied');
    });
  });

  describe('Edit user', () => {
    it('should edit user', () => {
      const editUserDto: EditUserDto = {
        email: 'test@savispain.es',
        firstName: 'Name',
        lastName: 'Surname User',
      };

      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(editUserDto)
        .expectStatus(200)
        .expectBodyContains(editUserDto.firstName)
        .expectBodyContains(editUserDto.email);
    });
  });
});
