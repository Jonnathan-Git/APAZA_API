import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateGalleryDto {
  @IsString()
  @IsNotEmpty()
  id:string;

  @IsNumber()
  @IsOptional()
  year: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  trashImages: string[];
}