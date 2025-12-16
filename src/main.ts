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
  const configService= app.get(ConfigService)
  const localhost= configService.get<number>('LOCAL_HOST')
  //cors
  app.enableCors({
    origin:`http://localhost:${localhost}`
  })
  
//listen
const port = configService.get<number>('PORT') ||3000
  await app.listen(port);
  console.log(`Escuchando en el puerto ${port}`)
}
bootstrap();
