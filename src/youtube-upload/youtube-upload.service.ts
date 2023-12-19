import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as fs from 'fs';
import { UploadVideoDTO } from './dto';
import axios from 'axios';

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
    const tokens = {
      access_token: this.configService.get<string>(
        'app.GOOGLE_TOKENS_ACCESS_TOKEN',
      ),
      refresh_token: this.configService.get<string>(
        'app.GOOGLE_TOKENS_REFRESH_TOKEN',
      ),
      scope: this.configService.get<string>('app.GOOGLE_TOKENS_SCOPE'),
      token_type: this.configService.get<string>(
        'app.GOOGLE_TOKENS_TOKEN_TYPE',
      ),
      id_token: this.configService.get<string>('app.GOOGLE_TOKENS_ID_TOKEN'),
      expiry_date: this.configService.get<number>(
        'app.GOOGLE_TOKENS_EXPIRY_DATE',
      ),
    };

    console.log('tokens', tokens);
    const redirectUrl = this.configService.get<string>(
      'app.YOUTUBE_REDIRECT_URL',
    );

    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUrl,
    );

    this.oauth2Client.setCredentials(tokens);

    this.youtubeClient = google.youtube({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }

  async uploadVideo(
    data: UploadVideoDTO,
    videoPath: string,
    imagePath: string,
  ) {
    try {
      const { title, description } = data;
      const resVideo = await this.youtubeClient.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title,
            description,
          },
          status: {
            privacyStatus: 'public', // or 'public' for public videos
          },
        },
        media: {
          body: fs.createReadStream(videoPath),
        },
      });

      const resThumbnail = await this.youtubeClient.thumbnails.set({
        videoId: resVideo.data.id,
        media: {
          body: fs.createReadStream(imagePath),
        },
      });
      return {
        video: resVideo.data,
        thumbnail: resThumbnail.data,
      };
    } catch (error) {
      console.error('Error uploading video:', error.message);
      throw new Error(`Failed to upload video to YouTube: ${error}`);
    }
  }

  async callback(code: string, res: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _that = this;
    if (code) {
      _that.oauth2Client.getToken(code, function (err, tokens) {
        if (err) throw err;
        console.log('tokens', tokens);
        _that.oauth2Client.setCredentials(tokens);
        _that.authed = true;
        res.redirect('http://localhost:3000/admin?tab=lecture');
      });
    }
  }

  async unauth() {
    this.authed = false;
    return { success: true };
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

  async getVideoResponse(video_id: string): Promise<any> {
    const API_KEY = this.configService.get<string>('app.YOUTUBE_API_KEY');
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${API_KEY}&part=snippet,statistics`;
    const res = await axios.get(endpoint);
    return res.data.items[0];
  }

  async getYouTubeViewCount(video_id: string) {
    // We destructure the statistics object and then access viewCount property as described ton api call method above
    const { statistics } = await this.getVideoResponse(video_id);
    return statistics.viewCount;
  }
}
