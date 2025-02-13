import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMemberDto{
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsOptional()
    photo?: string;
}