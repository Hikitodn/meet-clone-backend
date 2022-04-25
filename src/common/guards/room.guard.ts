import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly roomsService: RoomsService) {}

  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
