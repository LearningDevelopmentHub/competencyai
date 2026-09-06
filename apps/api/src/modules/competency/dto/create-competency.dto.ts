import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCompetencyDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsUUID()
  libraryId?: string;
}
