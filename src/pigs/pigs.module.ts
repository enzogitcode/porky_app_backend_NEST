import { Module } from '@nestjs/common';
import { PigsService } from './pigs.service';
import { PigsController } from './pigs.controller';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import {Pig, PigSchema} from './schema/pigs.schema'

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Pig.name,
      schema: PigSchema
    }
])],
  controllers: [PigsController],
  providers: [PigsService],
})
export class PigsModule {}
