import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class JoinRoomPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == metadata.data) return value;
    throw new BadRequestException('Query have to request or response');
  }
}
