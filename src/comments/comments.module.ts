import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SocketGateway } from '@utils/socket.util';

@Module({
  imports: [],
  controllers: [CommentsController],
  providers: [CommentsService, SocketGateway],
  exports: [],
})
export class CommentsModule {}
