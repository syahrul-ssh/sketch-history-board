import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSketchDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  imageData: string;

  @IsString()
  @IsNotEmpty()
  thumbnail: string;
}