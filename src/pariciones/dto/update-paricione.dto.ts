import { PartialType } from '@nestjs/mapped-types';
import { CreateParicioneDto } from './create-paricione.dto';

export class UpdateParicioneDto extends PartialType(CreateParicioneDto) {}
