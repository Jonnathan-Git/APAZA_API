import { Injectable } from '@nestjs/common';
import { Gallery } from './schema/Gallery.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ImageService } from 'src/logic/storage.logic';
import { Response } from 'src/domain/response';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { returnErrorMessage, returnInfoMessage, returnSuccessMessage } from 'src/logic/response.logic';
import { Message } from 'src/constants/message.constant';
import { BAD_REQUEST, CREATED, OK } from 'src/constants/code.constant';

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

  async findAll(): Promise<Response> {
    const response = this.galleryModel.find().then((response) => {
      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    });

    return response;
  }

  private async updateArrayImages(images: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = images.map(image => this.storageService.uploadImage(image));
    return Promise.all(uploadPromises);
  }

}
