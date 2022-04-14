import { IsNotEmpty } from 'class-validator';

export class LoginWithGoogleDto {
  @IsNotEmpty()
  id_token: string;
}
