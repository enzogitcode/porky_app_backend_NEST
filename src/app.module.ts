import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PigsModule } from './pigs/pigs.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './config/config'

@Module({
  imports: [PigsModule, MongooseModule.forRoot(config.mongo_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
