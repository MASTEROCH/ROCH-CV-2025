import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get user tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved' })
  async getTasks(@CurrentUser() user: any) {
    return this.tasksService.getTasks(user.id);
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete a task' })
  @ApiResponse({ status: 200, description: 'Task completed' })
  @ApiResponse({ status: 400, description: 'Task not found or already completed' })
  async completeTask(@CurrentUser() user: any, @Body() body: { taskId: string }) {
    return this.tasksService.completeTask(user.id, body.taskId);
  }
}