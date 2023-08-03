import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class YoutubeUploadService {
  private youtubeClient: any;

  constructor(private readonly configService: ConfigService) {
    this.initYoutubeClient();
  }

  private initYoutubeClient() {
    const clientId = this.configService.get<string>('YOUTUBE_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'YOUTUBE_CLIENT_SECRET',
    );
    const redirectUrl = this.configService.get<string>('YOUTUBE_REDIRECT_URL');
    const accessToken = this.configService.get<string>('YOUTUBE_ACCESS_TOKEN');
    const refreshToken = this.configService.get<string>(
      'YOUTUBE_REFRESH_TOKEN',
    );

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUrl
    );
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    this.youtubeClient = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });
  }

  async uploadVideo(title: string, description: string, videoPath: string) {
    try {
      const res = await this.youtubeClient.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title,
            description,
          },
          status: {
            privacyStatus: 'private', // or 'public' for public videos
          },
        },
        media: {
          body: fs.createReadStream(videoPath),
        },
      });
      return res.data;
    } catch (error) {
      console.error('Error uploading video:', error.message);
      throw new Error('Failed to upload video to YouTube');
    }
  }
}
