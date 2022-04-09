import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { VaidateMiddleware } from '../common/middlewares/validate.middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VaidateMiddleware).forRoutes('rooms');
  }
}
