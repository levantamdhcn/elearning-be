import { registerAs } from '@nestjs/config';

export const config = registerAs('youtube', () => ({
  YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
  YOUTUBE_REDIRECT_URL: process.env.YOUTUBE_REDIRECT_URL,
  YOUTUBE_ACCESS_TOKEN: process.env.YOUTUBE_ACCESS_TOKEN,
  YOUTUBE_REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN,
}));
