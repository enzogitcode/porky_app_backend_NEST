import { PartialType } from '@nestjs/mapped-types';
import { CreatePigDto } from './create-pig.dto';

export class UpdatePigDto extends PartialType(CreatePigDto) {}
