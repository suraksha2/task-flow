import { Role } from '../../../common/enums';
import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Activity } from '../../activity/entities/activity.entity';
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: Role;
    avatar: string;
    isActive: boolean;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    ownedProjects: Project[];
    projects: Project[];
    assignedTasks: Task[];
    reportedTasks: Task[];
    comments: Comment[];
    activities: Activity[];
    get fullName(): string;
}
