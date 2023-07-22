import { registerAs } from '@nestjs/config';

export const config = registerAs('cloudinary', () => ({
  CLOUDINARY_API_KEY: '561152556793449',
  CLOUDINARY_API_SECRET: 'V-obZv5xlmjqgVbNie1y7_ftlLg',
  CLOUDINARY_NAME: 'dgycitw77',
}));
