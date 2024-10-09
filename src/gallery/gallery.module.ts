import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schema/Gallery.schema';
import { ImageService } from 'src/logic/storage.logic';
import { FirebaseService } from 'src/data/storage';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Gallery.name,
      schema: GallerySchema,
    }])
  ],
  providers: [GalleryService,ImageService,FirebaseService],
  controllers: [GalleryController]
})
export class GalleryModule {}
