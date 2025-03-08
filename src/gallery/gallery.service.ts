import { Injectable } from '@nestjs/common';
import { Gallery } from './schema/Gallery.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ImageService } from 'src/logic/storage.logic';
import { Response } from 'src/domain/response';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { returnErrorMessage, returnInfoMessage, returnSuccessMessage } from 'src/logic/response.logic';
import { Message } from 'src/constants/message.constant';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from 'src/constants/code.constant';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { PaginationGalleryDto } from './dto/pagination-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(@InjectModel(Gallery.name) private readonly galleryModel: Model<Gallery>, private readonly storageService: ImageService) { }

  async create(gallery: CreateGalleryDto, images?: Express.Multer.File[]): Promise<Response> {
    try {
      // Crear la galería sin imágenes inicialmente
      const createdGallery = new this.galleryModel(gallery);
      let savedGallery = await createdGallery.save();

      if (!savedGallery) {
        return returnInfoMessage([Message.ERROR_CREATED_MESSAGE], BAD_REQUEST);
      }
      // Si hay imágenes, actualizar la galería con las referencias
      if (images && images.length > 0) {
        const updatedImages = await this.updateArrayImages(images);
        savedGallery = await this.galleryModel.findByIdAndUpdate(
          savedGallery.id,
          { $set: { images: updatedImages } },
          { new: true }
        );
      }

      return returnSuccessMessage([Message.CREATED_MESSAGE], CREATED, savedGallery);
    } catch (error) {
      return returnErrorMessage([Message.ERROR_CREATED_MESSAGE], BAD_REQUEST, error);
    }
  }

  async findAll(page: number = 1, limit:number = 5): Promise<Response> {
    const skip = (page - 1) * limit;
    try {
      const [galleries, total] = await Promise.all([
        this.galleryModel
          .find()
          .sort({ year: -1 }) // Ordenar por año de forma descendente
          .skip(skip)
          .limit(limit)
          .exec(),
        this.galleryModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      const responseObj = new PaginationGalleryDto(galleries, page, limit, totalPages, total);

      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, responseObj);
    } catch (error) {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    }
  }

  async findById(id: string): Promise<Response> {
    return this.galleryModel.findById(id).then((response) => {
      if (!response) { return returnInfoMessage([Message.NOT_FOUND_MESSAGE], NOT_FOUND); }
      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    });
  }

  async update({ id, year, description, trashImages }: UpdateGalleryDto, newImages?: Express.Multer.File[]): Promise<Response> {
    const galleryToUpdate: Gallery = await this.galleryModel.findById(id);
    if (!galleryToUpdate) {
      return returnInfoMessage([Message.NOT_FOUND_MESSAGE], NOT_FOUND);
    }

    const newImagesReferences = await this.processNewImages(newImages);
    const updatedImages = this.updateImageList(galleryToUpdate.images, trashImages, newImagesReferences);

    try {
      const updatedGallery = await this.updateGalleryInDatabase(id, year, description, updatedImages);
      //await this.deleteTrashImages(trashImages);

      return returnSuccessMessage([Message.UPDATED_MESSAGE], OK, updatedGallery);
    } catch (error) {
      return returnErrorMessage([Message.ERROR_UPDATED_MESSAGE], BAD_REQUEST, error);
    }
  }


  async delete(id: string): Promise<Response> {
    return this.galleryModel.findByIdAndDelete(id).then(async (response) => {
      if (!response) {
        return returnInfoMessage([Message.NOT_FOUND_MESSAGE], NOT_FOUND);
      }
      await this.deleteArrayImages(response.images);
      return returnSuccessMessage([Message.DELETED_MESSAGE], OK, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_DELETED_MESSAGE], BAD_REQUEST, error);
    })
  }

  private async updateArrayImages(images: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = images.map(image => this.storageService.uploadImage(image));
    return Promise.all(uploadPromises);
  }

  private async deleteArrayImages(images: string[]): Promise<void> {
    const deletePromises = images.map(image => this.storageService.deleteImage(image));
    Promise.all(deletePromises);
  }

  private async processNewImages(newImages?: Express.Multer.File[]): Promise<string[]> {
    return newImages?.length ? await this.updateArrayImages(newImages) : [];
  }

  private updateImageList(currentImages: string[], trashImages: string[] = [], newImages: string[] = []): string[] {
    const filteredImages = trashImages.length
      ? currentImages.filter(image => !trashImages.includes(image))
      : currentImages;
    return [...filteredImages, ...newImages];
  }

  private async updateGalleryInDatabase(id: string, year: number, description: string, images: string[]): Promise<Gallery> {
    return this.galleryModel.findByIdAndUpdate(
      id,
      { $set: { year, description, images } },
      { new: true }
    );
  }

  private async deleteTrashImages(trashImages: string[] = []): Promise<void> {
    if (trashImages.length) {
      await this.deleteArrayImages(trashImages);
    }
  }
}
