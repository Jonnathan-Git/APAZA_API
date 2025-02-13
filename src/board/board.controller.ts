import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { BoardService } from './board.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidator } from 'src/validators/validators';
import { CreateMemberDto } from './dto/create-member.dto';
import { Response } from 'src/domain/response';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('board')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

     @Post()
     @UseInterceptors(FileInterceptor('image'))
        async create(
        @UploadedFile(imageValidator()) img: Express.Multer.File,
        @Body(new ValidationPipe()) member: CreateMemberDto,
        ): Promise<Response> {
        return this.boardService.create(member, img);
        }

    @Put()
    @UseInterceptors(FileInterceptor('new-image'))
    async update(
        @Body(new ValidationPipe()) member: UpdateMemberDto,
        @UploadedFile(imageValidator()) img?: Express.Multer.File
    ): Promise<Response> {
        return this.boardService.update(member, img);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Response> {
        return this.boardService.delete(id);
    }

    @Get()
    async findAll(): Promise<Response> {
        return this.boardService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Response> {
        return this.boardService.findById(id);
    }

}
