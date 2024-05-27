import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [EventsModule],
  providers: [TasksService],
})
export class TasksModule {}
