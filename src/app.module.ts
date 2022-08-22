import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import * as Joi from 'joi';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { getEnvPath } from './common/utils/env.util';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { VerificationEntity } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { RestaurantEntity } from './restaurants/entities/restaurant.entity';
import { CategoryEntity } from './restaurants/entities/category.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        SECRET_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
      context: ({ req }) => {
        return {
          user: req.user,
        };
      },
    }),
    TypeOrmCoreModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'production',
      logging:
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test',
      entities: [
        UserEntity,
        VerificationEntity,
        RestaurantEntity,
        CategoryEntity,
      ],
    }),
    JwtModule.forRoot({
      secretKey: process.env.SECRET_KEY,
    }),
    MailModule.forRoot({
      domain: process.env.MAILGUN_API_KEY,
      APIKey: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    UsersModule,
    MailModule,
    RestaurantsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
