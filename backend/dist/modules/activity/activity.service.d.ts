import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
export declare class ActivityService {
    private activityRepository;
    constructor(activityRepository: Repository<Activity>);
    create(createActivityDto: CreateActivityDto): Promise<Activity>;
    findByProject(projectId: string, limit?: number): Promise<Activity[]>;
    findByTask(taskId: string, limit?: number): Promise<Activity[]>;
    findByUser(userId: string, limit?: number): Promise<Activity[]>;
}
