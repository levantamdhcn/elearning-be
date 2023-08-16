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

  async getUsers(search: string) {
    const users = await this.userModel.find();
    if (search) {
      const filtered = users.filter(
        (u) =>
          u.username?.includes(search) ||
          u.fullname?.includes(search) ||
          u.email?.includes(search),
      );

      return filtered;
    }
    console.log('users', users);
    return users;
  }

  async update(_id: string, updateUserDTO: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(_id, updateUserDTO);
  }

  async changePassword(_id: string, newPassword: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(_id, {
      password: await this.hashPassword(newPassword),
    });
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
