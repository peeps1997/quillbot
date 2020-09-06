import { IsString, IsDefined } from 'class-validator';

export class UnSubscribeVideoDTO {
  @IsDefined()
  @IsString()
  readonly channelID: string;
}
