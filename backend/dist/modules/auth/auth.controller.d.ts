import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { User } from '../users/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./auth.service").TokenPayload>;
    login(loginDto: LoginDto): Promise<import("./auth.service").TokenPayload>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<import("./auth.service").TokenPayload>;
    logout(user: User): Promise<void>;
}
