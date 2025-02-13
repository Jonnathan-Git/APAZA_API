import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from './schema/Board.schema';
import { Model } from 'mongoose';
import { CreateMemberDto } from './dto/create-member.dto';
import {
  returnErrorMessage,
  returnInfoMessage,
  returnSuccessMessage,
} from 'src/logic/response.logic';
import { Message } from 'src/constants/message.constant';
import { BAD_REQUEST, CREATED, OK } from 'src/constants/code.constant';
import { ImageService } from 'src/logic/storage.logic';
import { UpdateMemberDto } from './dto/update-member.dto';
import { isEmpty } from 'class-validator';
import { Response } from 'src/domain/response';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly storageService: ImageService,
  ) {}

  async create(
    member: CreateMemberDto,
    img: Express.Multer.File,
  ): Promise<Response> {
    const result = await this.storageService.uploadImage(img);
    member.photo = result;
    const createdMember = new this.boardModel(member);
    const response = createdMember
      .save()
      .then((response) => {
        return returnSuccessMessage(
          [Message.CREATED_MESSAGE],
          CREATED,
          response,
        );
      })
      .catch((error) => {
        return returnErrorMessage(
          [Message.ERROR_CREATED_MESSAGE],
          BAD_REQUEST,
          error,
        );
      });

    return response;
  }

  async update(
    member: UpdateMemberDto,
    img?: Express.Multer.File,
  ): Promise<Response> {
    if (!isEmpty(img)) {
      await this.storageService.deleteImage(member.photo);
      const result = await this.storageService.uploadImage(img);
      member.photo = result;
    }
    const response = this.boardModel
      .findByIdAndUpdate(member.id, member, { new: true })
      .then((response) => {
        if (!response) {
          return returnInfoMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST);
        }
        return returnSuccessMessage([Message.UPDATED_MESSAGE], OK, response);
      })
      .catch((error) => {
        return returnErrorMessage(
          [Message.ERROR_UPDATED_MESSAGE],
          BAD_REQUEST,
          error,
        );
      });

    return response;
  }

  async delete(id: string): Promise<Response> {
    try {
      const response = await this.boardModel.findByIdAndDelete(id);

      if (!response) {
        return returnInfoMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST);
      }

      try {
        await this.storageService.deleteImage(response.photo);
      } catch (error) {
        return returnErrorMessage(
          [Message.ERROR_DELETED_MESSAGE],
          BAD_REQUEST,
          error,
        );
      }

      return returnInfoMessage([Message.DELETED_MESSAGE], OK);
    } catch (error) {
      return returnErrorMessage(
        [Message.ERROR_DELETED_MESSAGE],
        BAD_REQUEST,
        error,
      );
    }
  }

  async findAll(): Promise<Response> {
    return this.boardModel
      .find()
      .then((response) => {
        return returnSuccessMessage([Message.FOUND_MESSAGE], OK, response);
      })
      .catch((error) => {
        return returnErrorMessage(
          [Message.ERROR_FOUND_MESSAGE],
          BAD_REQUEST,
          error,
        );
      });
  }

  async findById(id: string): Promise<Response> {
    const response = this.boardModel
      .findById(id)
      .then((response) => {
        if (!response) {
          return returnInfoMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST);
        }
        return returnSuccessMessage([Message.FOUND_MESSAGE], OK, response);
      })
      .catch((error) => {
        return returnErrorMessage(
          [Message.ERROR_FOUND_MESSAGE],
          BAD_REQUEST,
          error,
        );
      });

    return response;
  }
}
