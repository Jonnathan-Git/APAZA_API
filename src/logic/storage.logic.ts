import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/data/storage';

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) {}

  public async uploadImage(img: Express.Multer.File): Promise<string> {
    const storageRef = this.firebaseService.getStorageRef().child(img.originalname);
    
    try {
      await storageRef.put(img.buffer);
      const url = await storageRef.getDownloadURL();
      return url;
    } catch (error) {
      return "Sin imagen";
    }
  }
}
