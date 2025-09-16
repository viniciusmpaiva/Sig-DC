import { PartialType } from '@nestjs/mapped-types';
import { CreateOccurrenceDto } from './create-occurrence.dto';

export class UpdateOccurrenceDto extends PartialType(CreateOccurrenceDto) {}
