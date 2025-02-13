import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateMemberDto {
  @IsString()
  @IsNotEmpty()
  id:string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  photo?: string;
}