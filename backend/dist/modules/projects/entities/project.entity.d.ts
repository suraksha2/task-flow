import { User } from '../../users/entities/user.entity';
import { Board } from '../../boards/entities/board.entity';
import { Activity } from '../../activity/entities/activity.entity';
export declare class Project {
    id: string;
    name: string;
    description: string;
    key: string;
    icon: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: User;
    ownerId: string;
    members: User[];
    boards: Board[];
    activities: Activity[];
}
