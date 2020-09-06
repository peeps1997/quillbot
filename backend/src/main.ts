import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CoreModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';

(() => {
  return new Promise<boolean>(
    (
      resolve: (value?: boolean | PromiseLike<boolean>) => void,
      reject: (reason?: unknown) => void,
    ) => {
      NestFactory.create<NestExpressApplication>(CoreModule).then(
        (app: NestExpressApplication) => {
          app.set('trust proxy', 1);
          app.disable('x-powerted-by');
          app.enableCors({
            origin: '*',
            credentials: true,
          });
          const config = app.get<ConfigService>(ConfigService);
          const port = parseInt(config.get<string>('PORT'));
          const host = config.get<string>('HOST');
          app.setGlobalPrefix('api');
          app
            .listen(
              !_.isNaN(port) ? port : 3000,
              !_.isNil(host) ? host : '0.0.0.0',
            )
            .then(() => {
              app
                .getUrl()
                .then((url: string) => {
                  console.log(`Server started at ${host}, ${port}`);
                  resolve(true);
                })
                .catch((error: Error) => {
                  console.log(error.message);
                  reject();
                  process.exit(0);
                });
            });
        },
      );
    },
  );
})();
