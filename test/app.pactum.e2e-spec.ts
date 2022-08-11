import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { UpdateHolidayRequestStatusDto } from 'src/holiday/dto/update-holiday-request-status.dto';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { CommentHolidayRequestDto, CreateHolidayDto } from '../src/holiday/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

describe('App E2E', () => {
  let app: INestApplication;

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
    await app.get(PrismaService).cleanDatabase();

    pactum.request.setBaseUrl('http://localhost:3334');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'fcalle@savispain.es',
      password: '1234',
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(202)
          .stores('userAt', 'access_token');
      });
    });

    describe('User', () => {
      describe('Get me', () => {
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
      });

      describe('Edit user', () => {
        it('should edit user', () => {
          const dto: EditUserDto = {
            email: 'fcalle@savispain.es',
            firstName: 'Francisco',
          };
          return pactum
            .spec()
            .patch('/users')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.firstName)
            .expectBodyContains(dto.email);
        });
      });

      describe('Switch role', () => {
        it('should become admin', () => {
          const dto: EditUserDto = {
            role: ['USER', 'ADMIN'],
          };
          return pactum
            .spec()
            .patch('/users/1/roles')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(dto)
            .expectStatus(200)
            .expectBodyContains(dto.role)
            .expectJsonMatch('role', ['USER', 'ADMIN']);
        });
      });
    });
  });

  describe('Holiday Requests', () => {
    describe('Create', () => {
      const start = new Date();
      const end = new Date();
      end.setMonth(start.getMonth() + 1);
      const dto: CreateHolidayDto = {
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
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.start)
          .expectBodyContains(dto.end);
      });

      it('should fail for the same holiday request', () => {
        return pactum
          .spec()
          .post('/holidays')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(409)
          .expectBodyContains('Request already created');
      });

      it('should retrieve my holiday requests', () => {
        return pactum
          .spec()
          .get('/holidays')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Read', () => {
      it('should retrieve holiday requests for user', () => {
        return pactum
          .spec()
          .get('/holidays/user/1')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });

      it('should retrieve empty array for non existing user', () => {
        return pactum
          .spec()
          .get('/holidays/user/-1')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });

      it('should retrieve all the requests', () => {
        return pactum
          .spec()
          .get('/holidays')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Update', () => {
      it('should comment on request', () => {
        const dto: CommentHolidayRequestDto = {
          comment: 'Lorem ipsum',
          holidayRequestId: 1,
          userId: 1,
        };
        pactum
          .spec()
          .post('/holidays/1/comments')
          .withBody(dto)
          .expectStatus(201)
          .expectBody(dto.comment);
      });

      describe('change status', () => {
        it('should fail on invalid status', () => {
          const dto: UpdateHolidayRequestStatusDto = {
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
            .withBody(dto)
            .expectStatus(400)
            .expectBodyContains('Invalid status');
        });

        it('should reject request', () => {
          const dto: UpdateHolidayRequestStatusDto = {
            comment: 'Lorem ipsum',
            holidayRequestId: 1,
            status: 'REJECTED',
            validatorId: 1,
          };
          pactum
            .spec()
            .post('/holidays/1/validations')
            .withBody(dto)
            .expectStatus(201)
            .expectBody(dto.status)
            .expectBody(dto.comment);
        });

        it('should fail on same status request', () => {
          const dto: UpdateHolidayRequestStatusDto = {
            comment: 'Lorem ipsum',
            holidayRequestId: 1,
            status: 'REJECTED',
            validatorId: 1,
          };
          pactum
            .spec()
            .post('/holidays/1/validations')
            .withBody(dto)
            .expectStatus(400)
            .expectBodyContains('Invalid status');
        });

        it('should approve request', () => {
          const dto: UpdateHolidayRequestStatusDto = {
            comment: 'Lorem ipsum',
            holidayRequestId: 1,
            status: 'APPROVED',
            validatorId: 1,
          };
          pactum
            .spec()
            .post('/holidays/1/validations')
            .withBody(dto)
            .expectStatus(201)
            .expectBody(dto.status)
            .expectBody(dto.comment);
        });
      });
    });
  });
});
