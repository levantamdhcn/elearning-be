import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(@UploadedFile() avatar: Express.Multer.File, data: User) {
    const url = await this.cloudinaryService.uploadFile(avatar);
    const user = new this.userModel({
      ...data,
      avatar: url,
      password: await this.hashPassword(data.password),
    });

    await user.save();

    return user;
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
