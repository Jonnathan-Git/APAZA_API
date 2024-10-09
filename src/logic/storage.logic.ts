import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/data/storage';
import * as sharp from 'sharp';
import { generateUUID } from './logic';

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) { }

  public async uploadImage(img: Express.Multer.File): Promise<string> {
    const storageRef = this.firebaseService.getStorageRef().child(`${generateUUID()}.webp`);

    try {
      const webpImage = await this.convertToWebp(img);
      await storageRef.put(webpImage);
      const url = await storageRef.getDownloadURL();
      return url;
    } catch (error) {
      return "Sin imagen";
    }
  }

  public async deleteImage(url: string): Promise<void> {
    try {
      await this.firebaseService.storage.refFromURL(url).delete();
    } catch (error) {
      console.log(error);
    }
  }

  public async convertToWebp(img: Express.Multer.File): Promise<Buffer> {
    try {
      // Convertir la imagen a formato webp usando sharp
      const webpImage = await sharp(img.buffer)
        .webp()
        .toBuffer();
      return webpImage;
    } catch (error) {
      throw new Error('Error al convertir la imagen a webp');
    }
  }

  public async uploadBatchImages(images: Express.Multer.File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const image of images) {
      const url = await this.uploadImage(image);
      urls.push(url);
    }
    return urls;
  }
}
