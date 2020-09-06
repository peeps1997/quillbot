import { Module, ValidationPipe } from '@nestjs/common';
import { CommentsModule } from 'src/comments/comments.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommentsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class CoreModule {}
