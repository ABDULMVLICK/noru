import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Toutes les routes commencent par /api
  app.setGlobalPrefix('api');

  // Validation automatique de toutes les entrées (via les DTO).
  // whitelist : enlève les champs non déclarés ; forbidNonWhitelisted : les refuse.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Autorise le frontend à appeler l'API. En production, on met l'URL Vercel
  // dans la variable CORS_ORIGIN ; en local, on autorise le serveur Vite.
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
