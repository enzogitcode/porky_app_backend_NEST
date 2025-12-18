import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PigsModule } from './pigs/pigs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { VacunasModule } from './vacunas/vacunas.module';

const envFile = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}.local`
  : '.env.development.local';
@Module({
  imports: [
    PigsModule, 
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URL');
        console.log(uri); // ✅ debugging
        if (!uri) {
          throw new Error('MONGO_URL no está definido en tu archivo de entorno!');
        }
        return { uri };
      }

    }),

  ConfigModule.forRoot({
    
    isGlobal:true,
    envFilePath:process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}.local`:`.env.development.local`
  }),
  PigsModule,
  UsersModule,
  VaccinesModule,
  VacunasModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
