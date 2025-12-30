import { UsersService } from './users.service';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): User;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    updateProfile(user: User, updateData: Partial<User>): Promise<User>;
    remove(id: string): Promise<void>;
}
