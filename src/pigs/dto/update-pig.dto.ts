import { PartialType } from '@nestjs/mapped-types';
import { CreatePigDto } from './create-pig.dto';
import {IsDate, IsObject, IsString} from 'class-validator'
import { pariciones } from './create-pig.dto';
export class UpdatePigDto extends PartialType(CreatePigDto) {
    @IsString()
    descripcion?: string;
    @IsDate()
    fechaFallecimiento?: Date;
    @IsObject()
    pariciones?:Array<pariciones>


}
