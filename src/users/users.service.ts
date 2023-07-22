import { Body, Injectable, Param, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/users.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Tokens } from 'src/auth/types';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService,
    private authService: AuthService,
  ) {}

  async create(@UploadedFile() avatar: Express.Multer.File, data: User): Promise<Tokens> {
    const url = await this.cloudinaryService.uploadFile(avatar);
    
    const user = new this.userModel({
      ...data,
      avatar: url,
      password: await this.hashPassword(data.password),
    });

    await user.save();
    const tokens = await this.authService.generateTokens(user._id, user.email);
    await this.authService.updateRefreshTokenHash(user._id, tokens.refresh_token);

    return tokens;
  }

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
