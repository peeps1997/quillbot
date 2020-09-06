import {
  IsString,
  IsDefined,
  Length,
  arrayMinSize,
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
} from 'class-validator';

export class SubscribeVideoDTO {
  @IsDefined()
  @IsString()
  readonly url: string;

  @IsArray()
  @IsDefined()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  readonly keywords: string[];

  @IsOptional()
  readonly youtubeID?: string;

  @IsDefined()
  @IsString()
  readonly channelID: string;
}
