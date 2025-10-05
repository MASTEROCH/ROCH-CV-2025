import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { BalancesService } from '../balances/balances.service';
import { ECONOMY_CONFIG } from '../../config/economy';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private balancesService: BalancesService,
  ) {}

  async getTasks(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { isActive: true },
    });

    const userTasks = await this.prisma.userTask.findMany({
      where: { userId },
    });

    return tasks.map(task => ({
      ...task,
      completed: userTasks.find(ut => ut.taskId === task.id)?.completed || false,
      completedAt: userTasks.find(ut => ut.taskId === task.id)?.completedAt,
    }));
  }

  async completeTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    const userTask = await this.prisma.userTask.findUnique({
      where: {
        userId_taskId: {
          userId,
          taskId,
        },
      },
    });

    if (userTask?.completed) {
      throw new Error('Task already completed');
    }

    // Mark task as completed
    await this.prisma.userTask.upsert({
      where: {
        userId_taskId: {
          userId,
          taskId,
        },
      },
      update: {
        completed: true,
        completedAt: new Date(),
      },
      create: {
        userId,
        taskId,
        completed: true,
        completedAt: new Date(),
      },
    });

    // Award reward
    await this.balancesService.addCoins(userId, task.reward);

    return {
      taskId,
      reward: task.reward,
      newBalance: await this.balancesService.getBalance(userId),
    };
  }
}