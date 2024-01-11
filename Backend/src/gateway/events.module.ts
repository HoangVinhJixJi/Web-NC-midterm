import { EventsGateway } from './events.gateway';
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [AuthModule],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
