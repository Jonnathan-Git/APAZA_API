import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateEventDto {

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
    
    @IsOptional()
    image?: File;
}