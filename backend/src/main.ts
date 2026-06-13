import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://localhost',
      'http://localhost',
      'http://localhost:3001',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.SWAGGER_HABILITADO === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Sistema de Gestión de Proyectos')
      .setDescription(
        'Descripción de la API del sistema de gestión de proyectos',
      )
      .setVersion('1.0')
      .addBearerAuth() // Habilita la autenticación por token JWT en la UI
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // Se configura en la ruta base definida por el prefijo global (ej: /api)
    SwaggerModule.setup(globalPrefix, app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
