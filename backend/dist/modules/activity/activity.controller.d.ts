import { ActivityService } from './activity.service';
import { User } from '../users/entities/user.entity';
export declare class ActivityController {
    private readonly activityService;
    constructor(activityService: ActivityService);
    findByProject(projectId: string, limit?: number): Promise<import("./entities/activity.entity").Activity[]>;
    findByTask(taskId: string, limit?: number): Promise<import("./entities/activity.entity").Activity[]>;
    findMyActivity(user: User, limit?: number): Promise<import("./entities/activity.entity").Activity[]>;
}
