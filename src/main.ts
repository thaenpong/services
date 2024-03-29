import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Api Document')
    /* .setDescription('The cats API description') */
    .setVersion('1.0')
    .addTag('asset')
    .addTag('categories')
    .addTag('job')
    .addTag('status')
    .addTag('department')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(3002);
}
bootstrap();
