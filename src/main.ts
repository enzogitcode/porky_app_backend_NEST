import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  //validations
  app.useGlobalPipes(new ValidationPipe({
       transform: true,   // convierte JSON en instancias de DTO y tipos correctos
    whitelist: true,   // elimina campos extra que no estén en el DTO
  }))
  
  //cors
  app.enableCors()
  
//listen
const configService= app.get(ConfigService)
const port = configService.get<number>('PORT') ||3000
  await app.listen(port);
  console.log(`Escuchando en el puerto ${port}`)
}
bootstrap();
