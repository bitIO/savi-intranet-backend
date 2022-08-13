import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { CommentHolidayRequestDto, CreateHolidayDto } from '../src/holiday/dto';
import { UpdateHolidayRequestStatusDto } from '../src/holiday/dto/update-holiday-request-status.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

describe('App E2E', () => {
  let app: INestApplication;

  const dto: AuthDto[] = [
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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3334);

    await app.get(PrismaService).holidayRequestsValidations.deleteMany();
    await app.get(PrismaService).holidayRequestsComments.deleteMany();
    await app.get(PrismaService).holidayRequests.deleteMany();
    await app.get(PrismaService).userHolidays.deleteMany();
    await app.get(PrismaService).user.deleteMany();

    pactum.request.setBaseUrl('http://localhost:3334');
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

  describe('User', () => {
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
      const end = new Date();
      end.setMonth(start.getMonth() + 1);
      const createHolidayDto: CreateHolidayDto = {
        end,
        start,
      };

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
          .get('/holidays/users/1')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });

      it('should fail retrieving others holiday requests', () => {
        return pactum
          .spec()
          .get('/holidays/users/2')
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
          email: 'fcalle@savispain.es',
          firstName: 'Francisco',
          lastName: 'Calle Moreno',
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

  describe('Approve user', () => {
    it('should retrieve all the requests', () => {
      return pactum
        .spec()
        .get('/holidays')
        .withHeaders({
          Authorization: 'Bearer $S{approveUserAt}',
        })
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('should retrieve holiday requests from other user', () => {
      return pactum
        .spec()
        .get('/holidays/users/1')
        .withHeaders({
          Authorization: 'Bearer $S{approveUserAt}',
        })
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('should retrieve empty array for non existing user', () => {
      return pactum
        .spec()
        .get('/holidays/users/-1')
        .withHeaders({
          Authorization: 'Bearer $S{approveUserAt}',
        })
        .expectStatus(200)
        .expectJsonLength(0);
    });

    describe('change status', () => {
      it('should fail on invalid request id', () => {
        const invalidIdDto: UpdateHolidayRequestStatusDto = {
          comment: 'Lorem ipsum',
          holidayRequestId: 100,
          status: 'APPROVED',
          validatorId: 1,
        };
        pactum
          .spec()
          .post('/holidays/1/validations')
          .withHeaders({
            Authorization: 'Bearer $S{approveUserAt}',
          })
          .withBody(invalidIdDto)
          .expectStatus(400)
          .expectBodyContains('Invalid status');
      });

      it('should fail on invalid status', () => {
        const invalidStatusDto: UpdateHolidayRequestStatusDto = {
          comment: 'Lorem ipsum',
          holidayRequestId: 1,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          status: 'VALID',
          validatorId: 1,
        };
        pactum
          .spec()
          .post('/holidays/1/validations')
          .withHeaders({
            Authorization: 'Bearer $S{approveUserAt}',
          })
          .withBody(invalidStatusDto)
          .expectStatus(400)
          .expectBodyContains('Invalid status');
      });

      it('should reject request', () => {
        const rejectHolidayRequestDto: UpdateHolidayRequestStatusDto = {
          comment: 'Project requirement',
          holidayRequestId: 1,
          status: 'REJECTED',
          validatorId: 1,
        };
        pactum
          .spec()
          .post('/holidays/1/validations')
          .withHeaders({
            Authorization: 'Bearer $S{approveUserAt}',
          })
          .withBody(rejectHolidayRequestDto)
          .expectStatus(201)
          .expectBody(rejectHolidayRequestDto.status)
          .expectBody(rejectHolidayRequestDto.comment);
      });

      it('should fail on same status request', () => {
        const sameStatusRequestDto: UpdateHolidayRequestStatusDto = {
          comment: 'Lorem ipsum',
          holidayRequestId: 1,
          status: 'REJECTED',
          validatorId: 1,
        };
        pactum
          .spec()
          .post('/holidays/1/validations')
          .withHeaders({
            Authorization: 'Bearer $S{approveUserAt}',
          })
          .withBody(sameStatusRequestDto)
          .expectStatus(400)
          .expectBodyContains('Invalid status');
      });

      it('should approve request', () => {
        const approveRequestDto: UpdateHolidayRequestStatusDto = {
          comment: 'Lorem ipsum',
          holidayRequestId: 1,
          status: 'APPROVED',
          validatorId: 1,
        };
        pactum
          .spec()
          .post('/holidays/1/validations')
          .withHeaders({
            Authorization: 'Bearer $S{approveUserAt}',
          })
          .withBody(approveRequestDto)
          .expectStatus(201)
          .expectBody(approveRequestDto.status)
          .expectBody(approveRequestDto.comment);
      });
    });
  });

  describe('Admin user', () => {
    describe('Switch role', () => {
      it('should add admin role to user', () => {
        const editUserDto: EditUserDto = {
          role: ['USER', 'ADMIN'],
        };

        return pactum
          .spec()
          .patch('/users/1/roles')
          .withHeaders({
            Authorization: 'Bearer $S{adminUserAt}',
          })
          .withBody(editUserDto)
          .expectStatus(200)
          .expectBodyContains(editUserDto.role);
      });
    });
  });
});
