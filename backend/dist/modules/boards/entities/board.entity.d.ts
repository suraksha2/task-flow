import { Project } from '../../projects/entities/project.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class Board {
    id: string;
    name: string;
    description: string;
    position: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    project: Project;
    projectId: string;
    tasks: Task[];
}
