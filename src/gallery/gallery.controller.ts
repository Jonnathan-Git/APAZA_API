import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { Response } from 'src/domain/response';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) { }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 30))
  async create(
    @Body(new ValidationPipe()) gallery: CreateGalleryDto,
    @UploadedFiles() images?: Express.Multer.File[]
  ): Promise<Response> {
    return this.galleryService.create(gallery, images);
  }

  @Put()
  @UseInterceptors(FilesInterceptor('newImages', 30))
  async update(
    @Body(new ValidationPipe()) gallery: UpdateGalleryDto,
    @UploadedFiles() newImages?: Express.Multer.File[]
  ): Promise<Response> {
    return this.galleryService.update(gallery, newImages);
  }

  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<Response> {
    return this.galleryService.findAll(page, limit);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Response> {
    return this.galleryService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Response> {
    return this.galleryService.delete(id);
  }
}
