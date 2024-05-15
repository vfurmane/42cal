import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EventsModule],
  providers: [TasksService],
})
export class TasksModule {}
