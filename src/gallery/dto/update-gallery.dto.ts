import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateGalleryDto {
  @IsString()
  @IsNotEmpty()
  id:string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  trashImages: string[];
}