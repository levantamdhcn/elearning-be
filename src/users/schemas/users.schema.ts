import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

  @Prop({ required: true, minlength: 6, maxlength: 30 })
  fullname: string;

  @Prop({ required: true, minlength: 6, maxlength: 20, unique: true })
  username: string;

  @Prop({
    required: true,
    default:
      'https://res.cloudinary.com/dgycitw77/image/upload/v1648286163/online-course/avatar-default_teo4nn.png',
  })
  avatar: string;

  @Prop({ required: true, minlength: 6, maxlength: 50, unique: true })
  email: string;

  @Prop({ required: true, minlength: 6, maxlength: 20 })
  password: string;

  @Prop()
  googleId: string;

  @Prop()
  facebookId: string;

  @Prop({ default: false })
  admin: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
