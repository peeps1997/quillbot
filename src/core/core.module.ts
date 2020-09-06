import { Module, ValidationPipe } from '@nestjs/common';
import { CommentsModule } from 'src/comments/comments.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [CommentsModule, ConfigModule.forRoot({ isGlobal: true }), ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
  }),],
  controllers: [],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class CoreModule { }
