import { registerAs } from '@nestjs/config';

export const config = registerAs('app', () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 3001,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  APP_HOST: process.env.APP_HOST,
  CLIENT_URL: process.env.CLIENT_URL,
  FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
  YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URL: process.env.YOUTUBE_REDIRECT_URL,
  YOUTUBE_ACCESS_TOKEN: process.env.YOUTUBE_ACCESS_TOKEN,
  YOUTUBE_REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
}));
