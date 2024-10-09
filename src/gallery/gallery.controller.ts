import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { Response } from 'src/domain/response';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService:GalleryService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images',30))
  async create(
    @Body(new ValidationPipe()) gallery: CreateGalleryDto,
    @UploadedFiles() images?: Express.Multer.File[]
  ): Promise<Response> {
    return this.galleryService.create(gallery,images);
  }

  @Get()
  async findAll(): Promise<Response> {
    return this.galleryService.findAll();
  }
}
