import { ActivityType } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class Activity {
    id: string;
    type: ActivityType;
    description: string;
    metadata: Record<string, any>;
    createdAt: Date;
    user: User;
    userId: string;
    project: Project;
    projectId: string;
    task: Task;
    taskId: string;
}
