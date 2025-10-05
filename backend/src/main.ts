import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar prefijo global para todas las rutas
  app.setGlobalPrefix('api');
  
  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://frontend:3000'],
    credentials: true,
  });

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('La Corporación Favorita API')
    .setDescription('API para gestión de reportes y pagos de ONGs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend corriendo en puerto ${port}`);
  console.log(`📖 Documentación API: http://localhost:${port}/api/docs`);
}

bootstrap();