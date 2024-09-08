import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './schema/Events.schema';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ImageService } from 'src/logic/storage.logic';
import { FirebaseService } from 'src/data/storage';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Event.name,
    schema: EventSchema,
  }])],
  providers: [EventService,ImageService,FirebaseService],
  controllers: [EventController]
})
export class EventModule { }
