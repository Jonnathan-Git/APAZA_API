import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Multer } from "multer";

export class UpdateEventDto {
    
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsOptional()
    title?: string;
    
    @IsString()
    @IsOptional()
    description?: string;
    
    @IsDateString()
    @IsOptional()
    date?: Date;
    
    @IsString()
    @IsOptional()
    type?: string;
    
    @IsString()
    @IsNotEmpty()
    image?: string;
}