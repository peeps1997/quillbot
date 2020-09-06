import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { extractYoutubeVideoID } from '@utils/youtube.util';
import { messages } from '@constants';
import _ from 'lodash';
import { SubscribeVideoDTO } from 'src/comments/dto/subscribe-video.dto';

@Injectable()
export class YoutubeIDPipe implements PipeTransform {
  async transform(value: SubscribeVideoDTO, metadata: ArgumentMetadata) {
    const parsedID = extractYoutubeVideoID(value.url);
    const payload = { ...value };
    if (_.isNil(parsedID)) {
      throw new BadRequestException(messages.YOUTUBE_INVALID_STREAM_URL);
    }
    payload.youtubeID = parsedID;
    return payload;
  }
}
