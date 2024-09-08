import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schema/Events.schema';
import { Model } from 'mongoose';
import { BAD_REQUEST, CREATED, OK } from 'src/constants/code.constant';
import { Response } from 'src/domain/response';
import { CreateEventDto } from './dtos/create-event.dto';
import { returnErrorMessage, returnInfoMessage, returnSuccessMessage } from 'src/logic/logic';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Message } from 'src/constants/message.constant';
import { ImageService } from 'src/logic/storage.logic';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>,
  private readonly storageService: ImageService) { }

  async create(event: CreateEventDto, img: Express.Multer.File): Promise<Response> {
    const result = await this.storageService.uploadImage(img);
    event.image = result;
    const createdEvent = new this.eventModel(event);
    return createdEvent.save().then((response) => {
      return returnSuccessMessage([Message.CREATED_MESSAGE], CREATED, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_CREATED_MESSAGE], BAD_REQUEST, error);
    });
  }

  async update(id: string, event: UpdateEventDto): Promise<Response> {
    return this.eventModel.findByIdAndUpdate(id, event, { new: true }).then((response) => {
      if (!response) {
        return returnInfoMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST);
      }
      return returnSuccessMessage([Message.UPDATED_MESSAGE], OK, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_UPDATED_MESSAGE], BAD_REQUEST, error);
    });
  }

  async delete(id: string): Promise<Response> {
    return this.eventModel.findByIdAndDelete(id).then((response) => {
      if (!response) {
        return returnInfoMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST);
      }
      return returnInfoMessage([Message.DELETED_MESSAGE], OK);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_DELETED_MESSAGE], BAD_REQUEST, error);
    });
  }

  async findAll(): Promise<Response> {
    return this.eventModel.find().then((response) => {
      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    });
  }

  async findById(id: string): Promise<Response> {
    return this.eventModel.findById(id).then((response) => {
      if (!response) {
        return returnInfoMessage([Message.NOT_FOUND_MESSAGE], OK);
      }
      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, response);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    });
  }
}
