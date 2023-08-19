import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class YoutubeUploadService {
  private youtubeClient: any;
  private authed: boolean;
  private oauth2Client: any;
  private SCOPES: string;

  constructor(private readonly configService: ConfigService) {
    this.initYoutubeClient();
    this.authed = false;
    this.SCOPES =
      'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/userinfo.profile';
  }

  private initYoutubeClient() {
    const clientId = this.configService.get<string>('app.YOUTUBE_CLIENT_ID');
    const clientSecret = this.configService.get<string>(
      'app.YOUTUBE_CLIENT_SECRET',
    );
    const redirectUrl = this.configService.get<string>(
      'app.YOUTUBE_REDIRECT_URL',
    );

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUrl,
    );

    this.youtubeClient = google.youtube({
      version: 'v3',
      auth: this.oauth2Client,
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

  async callback(code: string, res: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    if (code) {
      _that.oauth2Client.getToken(code, function (err, tokens) {
        if (err) throw err;

        _that.oauth2Client.setCredentials(tokens);
        _that.authed = true;
        res.redirect('http://localhost:3000/admin');
      });
    }
  }

  async auth() {
    if (!this.authed) {
      const url = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES,
      });
      return { url };
    } else {
      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2',
      });

      const response = await oauth2.userinfo.get();
      return {
        name: response.data.name,
        pic: response.data.picture,
        success: false,
      };
    }
  }
}
