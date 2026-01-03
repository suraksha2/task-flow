import { UsersService } from './users.service';
import { Role } from '../../common/enums';
import { User } from './entities/user.entity';
import { UpdateUserDto, AdminUpdateUserDto, ChangePasswordDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): User;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User | null>;
    updateProfile(user: User, updateData: UpdateUserDto): Promise<User>;
    changePassword(user: User, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    updateUser(id: string, updateData: AdminUpdateUserDto): Promise<User>;
    updateRole(id: string, role: Role): Promise<User>;
    toggleStatus(id: string): Promise<User>;
    getStats(): Promise<{
        total: number;
        active: number;
        byRole: Record<string, number>;
    }>;
    remove(id: string): Promise<void>;
}
