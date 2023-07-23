import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  UploadedFile,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Schema } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User, UserDocument } from 'src/users/schemas/users.schema';

import { UserService } from 'src/users/users.service';
import { jwtConstants } from './constants';
import { Tokens } from './types';
import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    // https://docs.nestjs.com/fundamentals/circular-dependency#forward-reference
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  async updateRefreshTokenHash(_id: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.userService.update(_id, {
      refreshToken: hash,
    });
  }

  async register(
    @UploadedFile() avatar: Express.Multer.File,
    data: RegisterDTO,
  ): Promise<Tokens> {
    const existingEmail = await this.userModel.findOne({ email: data?.email });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }
    const existingUsername = await this.userModel.findOne({
      username: data?.username,
    });
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    const { url } = avatar
      ? await this.cloudinaryService.uploadFile(avatar)
      : null;

    const user = new this.userModel({
      ...data,
      ...(url && { avatar: url }),
      password: await this.hashPassword(data.password),
    });

    await user.save();
    const tokens = await this.generateTokens(user._id, user.email);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token);

    return tokens;
  }

  async generateTokens(_id: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: _id,
          email,
        },
        {
          secret: jwtConstants.atSecret,
          expiresIn: 60 * 15, //15 minutes
        },
      ),
      this.jwtService.signAsync(
        {
          sub: _id,
          email,
        },
        {
          secret: jwtConstants.rfSecret,
          expiresIn: 60 * 60 * 24 * 7, //7 days
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(_id: string, refreshToken: string) {
    const user = await this.userService.findOne({
      refreshToken,
    });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.generateTokens(_id, user.email);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async siginIn(email: string, pass: string): Promise<Tokens> {
    const user = await this.userService.findOne({ email });
    if (!this.isMatch(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user._id, email);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    return this.userService.update(userId, { refreshToken: null });
  }

  async isMatch(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async isValidPassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }
}
