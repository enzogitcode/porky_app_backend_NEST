import { PartialType } from '@nestjs/mapped-types';
import { CreatePigDto, ParicionDto, Situacion } from './create-pig.dto';
import { IsArray, IsDate, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePigDto extends PartialType(CreatePigDto) {
  @IsString()
  descripcion?: string;
  
  @IsString()
  ubicacion?: string;

  @IsDate()
  fechaFallecimiento?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParicionDto)
  pariciones?: ParicionDto[];

  estadio?: Situacion
}
