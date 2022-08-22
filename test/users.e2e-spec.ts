import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { UsersService } from '../src/users/users.service';

const GraphQlEndpoint = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let userService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = module.get(UsersService);
    console.log(userService);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('createAccount', () => {
    const email = '"email2"';
    it('should create account ', async () => {
      return request(app.getHttpServer())
        .post(GraphQlEndpoint)
        .send({
          query: `mutation{
            createAccount(input: { email: ${email}, password: "passwords", role:CLIENT }){ok, error}
          }`,
        })
        .expect(200)
        .expect((res) => console.log(res.body));
    });
    it('should fail if account already exist', function () {});
  });

  it.todo('me');
  it.todo('userProfile');
  it.todo('login');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
