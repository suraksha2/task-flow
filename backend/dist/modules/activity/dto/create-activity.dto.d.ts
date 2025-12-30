import { ActivityType } from '../../../common/enums';
export declare class CreateActivityDto {
    type: ActivityType;
    description?: string;
    userId: string;
    projectId: string;
    taskId?: string;
    metadata?: Record<string, any>;
}
