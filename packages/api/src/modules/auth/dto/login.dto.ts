import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Telegram init data' })
  @IsString()
  @IsNotEmpty()
  initData: string;
}