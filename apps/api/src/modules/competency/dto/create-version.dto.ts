import { IsObject, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class BehavioralIndicatorDto {
  proficiencyLevel: number;
  text: any; // localized JSON {vi,en}
}

export class CreateVersionDto {
  @IsObject()
  title: any;

  @IsOptional()
  summary?: any;

  @IsOptional()
  @IsArray()
  behavioralIndicators?: BehavioralIndicatorDto[];
}
