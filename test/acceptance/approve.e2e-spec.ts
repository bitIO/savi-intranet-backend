import { INestApplication } from '@nestjs/common';
import { addBusinessDays } from 'date-fns';
import * as pactum from 'pactum';
import { AuthDto } from '../../src/auth/dto';
import { UpdateHolidayRequestStatusDto } from '../../src/holiday/dto';
import { initializeApplication } from '../utils/app';
import { cleanDatabase } from '../utils/database';
import { createTestUsers, users } from '../utils/users';

describe('APP Acceptance - Approve', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initializeApplication('acceptance-approve');
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

    await pactum
      .spec()
      .post('/holidays')
      .withHeaders({
        Authorization: 'Bearer $S{userAt}',
      })
      .withBody({
        end: addBusinessDays(new Date(), 7),
        start: new Date(),
      })
      .expectStatus(201);
  });

  afterAll(() => {
    app.close();
  });

  it('should retrieve all the requests', () => {
    return pactum
      .spec()
      .get('/holidays')
      .withHeaders({
        Authorization: 'Bearer $S{approveAt}',
      })
      .expectStatus(200)
      .expectJsonLength(1);
  });

  it('should retrieve holiday requests from other user', () => {
    return pactum
      .spec()
      .get('/holidays/users/1')
      .withHeaders({
        Authorization: 'Bearer $S{approveAt}',
      })
      .expectStatus(200)
      .expectJsonLength(1);
  });

  it('should retrieve empty array for non existing user', () => {
    return pactum
      .spec()
      .get('/holidays/users/-1')
      .withHeaders({
        Authorization: 'Bearer $S{approveAt}',
      })
      .expectStatus(200)
      .expectJsonLength(0);
  });

  describe('change status', () => {
    it('should fail on invalid request id', () => {
      const invalidIdDto: UpdateHolidayRequestStatusDto = {
        comment: 'Lorem ipsum',
        status: 'APPROVED',
        validatorId: 1,
      };
      pactum
        .spec()
        .post('/holidays/100/validations')
        .withHeaders({
          Authorization: 'Bearer $S{approveAt}',
        })
        .withBody(invalidIdDto)
        .expectStatus(400)
        .expectBodyContains('Invalid status');
    });

    it('should fail on invalid status', () => {
      const invalidStatusDto: UpdateHolidayRequestStatusDto = {
        comment: 'Lorem ipsum',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        status: 'VALID',
        validatorId: 1,
      };
      pactum
        .spec()
        .post('/holidays/1/validations')
        .withHeaders({
          Authorization: 'Bearer $S{approveAt}',
        })
        .withBody(invalidStatusDto)
        .expectStatus(400)
        .expectBodyContains('Invalid status');
    });

    it('should reject request', () => {
      const rejectHolidayRequestDto: UpdateHolidayRequestStatusDto = {
        comment: 'Project requirement',
        status: 'REJECTED',
        validatorId: 1,
      };
      pactum
        .spec()
        .post('/holidays/1/validations')
        .withHeaders({
          Authorization: 'Bearer $S{approveAt}',
        })
        .withBody(rejectHolidayRequestDto)
        .expectStatus(201)
        .expectBody(rejectHolidayRequestDto.status)
        .expectBody(rejectHolidayRequestDto.comment);
    });

    it('should fail on same status request', () => {
      const sameStatusRequestDto: UpdateHolidayRequestStatusDto = {
        comment: 'Lorem ipsum',
        status: 'REJECTED',
        validatorId: 1,
      };
      pactum
        .spec()
        .post('/holidays/1/validations')
        .withHeaders({
          Authorization: 'Bearer $S{approveAt}',
        })
        .withBody(sameStatusRequestDto)
        .expectStatus(400)
        .expectBodyContains('Invalid status');
    });

    it('should approve request', () => {
      const approveRequestDto: UpdateHolidayRequestStatusDto = {
        comment: 'Lorem ipsum',
        status: 'APPROVED',
        validatorId: 1,
      };
      pactum
        .spec()
        .post('/holidays/1/validations')
        .withHeaders({
          Authorization: 'Bearer $S{approveAt}',
        })
        .withBody(approveRequestDto)
        .expectStatus(201)
        .expectBody(approveRequestDto.status)
        .expectBody(approveRequestDto.comment);
    });
  });
});
