import { Controller, Res, Req, Body, Post, UsePipes } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { YoutubeIDPipe } from '@pipes/youtube.pipe';
import { SubscribeVideoDTO } from './dto/subscribe-video.dto';
import { UnSubscribeVideoDTO } from './dto/unsubscribe-video.dto';
import { Response } from 'express';
@Controller('api/comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Post('subscribe')
  @UsePipes(YoutubeIDPipe)
  subscribeVideo(
    @Body() payload: SubscribeVideoDTO,
    @Res() response: Response,
  ) {
    this.commentService
      .subscribeVideo(payload)
      .then(serverResponse => {
        response
          .status(serverResponse.status)
          .json({ message: serverResponse.message });
      })
      .catch(serverResponse => {
        response
          .status(serverResponse.status)
          .json({ message: serverResponse.message });
      });
  }

  @Post('unsubscribe')
  unsubscribeVideo(
    @Body() payload: UnSubscribeVideoDTO,
    @Res() response: Response,
  ) {
    this.commentService
      .unsubscribeVideo(payload)
      .then(serverResponse => {
        response
          .status(serverResponse.status)
          .json({ message: serverResponse.message });
      })
      .catch(serverResponse => {
        response
          .status(serverResponse.status)
          .json({ message: serverResponse.message });
      });
  }
}
