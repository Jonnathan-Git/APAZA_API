import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsOptional()
    image?: string;
}