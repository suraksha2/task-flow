import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = this.activityRepository.create(createActivityDto);
    return this.activityRepository.save(activity);
  }

  async findByProject(projectId: string, limit = 50): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { projectId },
      relations: ['user', 'task'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByTask(taskId: string, limit = 50): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { taskId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByUser(userId: string, limit = 50): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { userId },
      relations: ['project', 'task'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
