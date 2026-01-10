import { Module } from '@nestjs/common';
import { ParicionesService } from './pariciones.service';
import { ParicionesController } from './pariciones.controller';

@Module({
  controllers: [ParicionesController],
  providers: [ParicionesService],
})
export class ParicionesModule {}
