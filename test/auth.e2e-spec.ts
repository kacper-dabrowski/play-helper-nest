import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/ (PUT)', () => {
    const validUser = {
      password: 'p4ssword!23',
      startingPage: '/basic',
      username: 'jdoe1234',
      fullName: 'John Doe',
    };

    it('should allow a user to register using provided data', async () => {
      const { body, status } = await request(app.getHttpServer())
        .put('/auth')
        .send(validUser);

      expect(body.token).toEqual(expect.any(String));
      expect(status).toEqual(201);
    });

    it('should throw validation error, when body is not valid', async () => {
      const { status } = await request(app.getHttpServer()).put('/auth').send({
        password: 'p4ssword!23',
        startingPage: '/basic',
      });

      expect(status).toEqual(400);
    });

    it('should not allow to create the same user twice', async () => {
      const { status } = await request(app.getHttpServer())
        .put('/auth')
        .send(validUser);

      const { status: secondStatus } = await request(app.getHttpServer())
        .put('/auth')
        .send(validUser);

      expect(status).toEqual(201);
      expect(secondStatus).toEqual(409);
    });
  });
});
