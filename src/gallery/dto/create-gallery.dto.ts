import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateGalleryDto{
    @IsString()
    @IsNotEmpty()
    year: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsOptional()
    images: string[];
}