import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User as UserSchema, UserDocument } from './schemas/users.schema';
import { User } from './interface';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
  ) {}

  async update(_id: string, updateUserDTO: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(_id, updateUserDTO);
  }

  async findOne(query: object): Promise<User> {
    return this.userModel.findOne(query);
  }

  async isValidPassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }
}
