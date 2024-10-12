import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/Users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'src/domain/response';
import { returnErrorMessage, returnInfoMessage, returnSuccessMessage } from 'src/logic/response.logic';
import { Message } from 'src/constants/message.constant';
import { BAD_REQUEST, CREATED, NOT_FOUND, OK, UNAUTHORIZED } from 'src/constants/code.constant';
import { UpdateUserDto } from './dtos/update-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { EncryptLogic } from 'src/logic/encrypt.logic';
import { ResponseUserDTO } from './dtos/response-user.dto';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
  }


  async create(user: CreateUserDto): Promise<Response> {

    if (!await this.verifyRegisteredUser(user.email)) {
      user.password = await EncryptLogic.encryptPassword(user.password);

      const createdUser = new this.userModel(user);
      const response = createdUser.save().then((response) => {
        return returnSuccessMessage([Message.CREATED_MESSAGE], CREATED, new ResponseUserDTO(response.id,response.name, response.email, response.role));
      }).catch((error) => {
        return returnErrorMessage([Message.ERROR_CREATED_MESSAGE], BAD_REQUEST, error);
      });

      return response;
    }else{
      return returnInfoMessage([Message.ERROR_REGISTERED_MESSAGE], BAD_REQUEST);
    }
  }

  async update(user: UpdateUserDto): Promise<Response> {
    const response = this.userModel.findByIdAndUpdate(user.id, user, { new: true }).then((response) => {
      return returnSuccessMessage([Message.UPDATED_MESSAGE], OK, new ResponseUserDTO(response.id,response.name, response.email, response.role));
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_UPDATED_MESSAGE], BAD_REQUEST, error);
    });

    return response;
  }

  async delete(id: string): Promise<Response> {
    const response = this.userModel.findByIdAndDelete(id).then((response) => {
      if (!response) {
        return returnInfoMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST,);
      }
      return returnSuccessMessage([Message.LOGIN_SUCCESS_MESSAGE], OK, new ResponseUserDTO(response.id,response.name, response.email, response.role));
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_DELETED_MESSAGE], BAD_REQUEST, error);
    });

    return response;
  }

  async findAll(): Promise<Response> {
    const response = this.userModel.find().then((response) => {
      const res = response.map((user) => new ResponseUserDTO(user.id,user.name, user.email, user.role));
      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, res);
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    });

    return response;
  }

  async findById(id: string): Promise<Response> {
    const response = this.userModel.findById(id).then((response) => {
      if (!response) {
        return returnInfoMessage([Message.ERROR_FOUND_MESSAGE], NOT_FOUND);
      }
      return returnSuccessMessage([Message.FOUND_MESSAGE], OK, new ResponseUserDTO(response.id,response.name, response.email, response.role));
    }).catch((error) => {
      return returnErrorMessage([Message.ERROR_FOUND_MESSAGE], BAD_REQUEST, error);
    });

    return response;
  }

  async login(login: LoginUserDto): Promise<Response> {
    try {
      const response = await this.userModel.findOne().where('email').equals(login.email);

      if (!response) {
        return returnInfoMessage([Message.LOGIN_ERROR_MESSAGE], UNAUTHORIZED);
      }
      const correctPassword = await EncryptLogic.comparePassword(login.password, response.password);

      if (correctPassword) {
        return returnSuccessMessage([Message.LOGIN_SUCCESS_MESSAGE], OK, new ResponseUserDTO(response.id,response.name, response.email, response.role));
      } else {
        return returnInfoMessage([Message.LOGIN_ERROR_MESSAGE], UNAUTHORIZED);
      }
    } catch (error) {
      return returnErrorMessage([Message.LOGIN_ERROR_MESSAGE], UNAUTHORIZED, error);
    }
  }

  verifyRegisteredUser(email: string): Promise<boolean> {
    const response = this.userModel.findOne().where('email').equals(email).then((response) => {
      return response ? true : false;
    });
    return response;
  }
}
