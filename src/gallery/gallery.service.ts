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

  async findById(id: string): Promise<Response> {
    return this.galleryModel.findById(id).then((response) => {
      if (!response) { return returnInfoMessage([Message.NOT_FOUND_MESSAGE], NOT_FOUND); }
      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    });
  }

  async update({ id, title, description, trashImages }: UpdateGalleryDto, newImages?: Express.Multer.File[]): Promise<Response> {

    const galleryToUpdate: Gallery = await this.galleryModel.findById(id);
    if (!galleryToUpdate) {
      return returnInfoMessage([Message.NOT_FOUND_MESSAGE], NOT_FOUND);
    }

    // Actualizar imágenes si es necesario
    const newImagesReferences = newImages?.length ? await this.updateArrayImages(newImages) : [];
    let updatedImages = [];
    // Filtrar las imágenes no eliminadas y agregar las nuevas
    if(trashImages?.length && trashImages.length > 0) {
      updatedImages = [
        ...galleryToUpdate.images.filter(image => !trashImages.includes(image)),
        ...newImagesReferences
      ];
    }else{
      updatedImages = [...galleryToUpdate.images, ...newImagesReferences];
    }

    try {
      const updatedGallery = await this.galleryModel.findByIdAndUpdate(
        id,
        {
          $set: { title, description, images: updatedImages }
        },
        { new: true }
      );
      // Eliminar imágenes si es necesario
      trashImages?.length ? await this.deleteArrayImages(trashImages) : [];

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
}
