import { Controller, Body, ValidationPipe, Post, Get, Put, Delete, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EventService } from './event.service';
import { Response } from 'src/domain/response';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageValidator } from 'src/validators/validators';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))  // Cambiado a FileInterceptor para un solo archivo
  async create(
    @UploadedFile(imageValidator()) img: Express.Multer.File,
    @Body(new ValidationPipe()) event: CreateEventDto,
  ): Promise<Response> {
    return this.eventService.create(event, img);
  }
  
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ValidationPipe()) event: UpdateEventDto): Promise<Response> {
    return this.eventService.update(id, event);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Response> {
    return this.eventService.delete(id);
  }

  @Get()
  async findAll(): Promise<Response> {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Response> {
    return this.eventService.findById(id);
  }
}
