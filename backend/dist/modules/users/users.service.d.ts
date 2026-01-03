import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../../common/enums';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, updateData: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
    updateRole(id: string, role: Role): Promise<User>;
    toggleUserStatus(id: string): Promise<User>;
    changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
    getUserStats(): Promise<{
        total: number;
        active: number;
        byRole: Record<string, number>;
    }>;
}
