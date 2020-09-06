import { Injectable, HttpStatus } from '@nestjs/common';
import { SubscribeVideoDTO } from './dto/subscribe-video.dto';
import { google, youtube_v3 } from 'googleapis';
import _ from 'lodash';
import { messages } from '@constants';
import { SocketGateway } from '@utils/socket.util';
import YoutubeLiveChat from '@utils/chat.util';
import { UnSubscribeVideoDTO } from './dto/unsubscribe-video.dto';
import { ServerResponse } from '@models/response.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentsService {
  private _youtubeHandler: youtube_v3.Youtube;
  private _chatListeners: { listener: YoutubeLiveChat; channel: string }[] = [];
  constructor(
    private readonly _socketGateway: SocketGateway,
    private configService: ConfigService,
  ) {
    this._youtubeHandler = google.youtube({
      version: 'v3',
      auth: this.configService.get<string>('API_KEY'),
    });
  }

  subscribeVideo = (payload: SubscribeVideoDTO) =>
    new Promise<ServerResponse>((resolve, reject) => {
      this._youtubeHandler.videos
        .list({
          id: [payload.youtubeID],
          part: ['liveStreamingDetails'],
        })
        .then(response => {
          if (!_.isNil(response.data) && !_.isEmpty(response.data.items)) {
            const interval = parseInt(
              this.configService.get<string>('INTERVAL'),
            );
            const activeLiveChatID =
              response.data.items[0].liveStreamingDetails?.activeLiveChatId;
            if (!_.isNil(activeLiveChatID)) {
              this._chatListeners.push({
                channel: payload.channelID,
                listener: new YoutubeLiveChat(
                  activeLiveChatID,
                  !isNaN(interval) ? interval : 2500,
                  this._youtubeHandler,
                  payload.channelID,
                  this._socketGateway.server,
                  payload.keywords,
                ),
              });
              this._chatListeners
                .find(chatListener =>
                  _.eq(payload.channelID, chatListener.channel),
                )
                ?.listener.run();
              resolve({
                message: messages.YOUTUBE_SUBSCRIBED_SUCCESS,
                status: HttpStatus.OK,
              });
            } else {
              reject({
                message: messages.YOUTUBE_NOT_STREAM_URL,
                status: HttpStatus.FORBIDDEN,
              });
            }
          } else {
            reject({
              message: messages.YOUTUBE_NOT_FOUND_STREAM_URL,
              status: HttpStatus.FORBIDDEN,
            });
          }
        })
        .catch((error: Error) => {
          reject({
            message: error.message,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        });
    });

  unsubscribeVideo = (payload: UnSubscribeVideoDTO) =>
    new Promise<ServerResponse>(resolve => {
      const listenerObject = this._chatListeners.find(listener =>
        _.eq(payload.channelID, listener.channel),
      )?.listener;
      if (!_.isNil(listenerObject)) {
        listenerObject.stop();
        this._chatListeners = this._chatListeners.filter(listener => {
          return !_.eq(payload.channelID, listener.channel);
        });
      }
      resolve({
        message: messages.YOUTUBE_UNSUBSCRIBED_SUCCESS,
        status: HttpStatus.OK,
      });
    });
}
