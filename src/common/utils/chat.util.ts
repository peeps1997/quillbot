import {
  ILiveChatMessage,
  IYoutubeLiveChatResponse,
} from '@models/youtube.model';
import { youtube_v3 } from 'googleapis';
import { Server } from 'socket.io';
import _ from 'lodash';

class YoutubeLiveChat {
  private liveChatId: string;
  private nextPage: string;
  private channelID: string;
  private keywords: string[];
  private interval: number;
  private socketServer: Server;
  private _youtubeHandler: youtube_v3.Youtube;
  private loop: NodeJS.Timer | null;

  constructor(
    liveChatId: string,
    interval: number,
    youtubeHandler: youtube_v3.Youtube,
    channelID: string,
    socketServer: Server,
    keywords: string[],
  ) {
    this._youtubeHandler = youtubeHandler;
    this.liveChatId = liveChatId;
    this.interval = interval;
    this.socketServer = socketServer;
    this.keywords = keywords;
    this.channelID = channelID;
    this.nextPage = '';
    this.loop = null;
  }

  public run() {
    this.loop = setInterval(() => this.getChatMessages(), this.interval);
  }

  public stop() {
    if (this.loop) {
      clearInterval(this.loop);
    }
  }

  private async getChatMessages(): Promise<void> {
    try {
      this._youtubeHandler.liveChatMessages
        .list({
          part: ['snippet', 'authorDetails'],
          liveChatId: this.liveChatId,
          maxResults: 10,
          pageToken: this.nextPage !== '' ? this.nextPage : '',
        })
        .then(response => {
          const data = response.data;
          if (!_.isNil(response.data.nextPageToken)) {
            this.nextPage = data.nextPageToken;
          }
          if (_.eq(data.kind, 'youtube#liveChatMessageListResponse')) {
            data.items.forEach((value, index, array) => {
              if (_.eq(value.snippet.type, 'chatEndedEvent')) {
                this.stop();
              } else {
                if (!_.isNil(value?.snippet?.textMessageDetails?.messageText)) {
                  if (
                    isPresent(
                      value.snippet.textMessageDetails.messageText.toLowerCase(),
                      this.keywords,
                    )
                  ) {
                    this.socketServer.emit(`${this.channelID}`, {
                      message: value.snippet.textMessageDetails.messageText,
                      profile: value.authorDetails.profileImageUrl,
                      author: value.authorDetails.displayName,
                    });
                  }
                }
              }
            });
          }
        })
        .catch(() => {
          return;
        });
    } catch (error) {}
  }
}

const isPresent = (text: string, keywords: string[]) => {
  let isPresent = false;
  keywords.forEach(keyword => {
    if (_.includes(text, keyword.toLowerCase())) {
      isPresent = true;
    }
  });
  return isPresent;
};
export default YoutubeLiveChat;
