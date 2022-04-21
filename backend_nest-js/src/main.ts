import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      name: process.env.SESSION_NAME || 'sid',
      secret: process.env.SESSION_SECRET || 'session-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: process.env.COOKIE_HTTPONLY == 'true' ? true : false,
        secure: process.env.COOKIE_SECURE == 'true' ? true : false,
        maxAge: parseInt(process.env.COOKIE_MAXAGE) || 1000 * 60 * 60 * 24 * 7, //1 week
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Meet Clone Api')
    .setDescription('Meet Clone Api')
    .setVersion('1.0')
    .addTag('Meet Clone Api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
