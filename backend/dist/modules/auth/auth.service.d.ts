import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';
export interface TokenPayload {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<TokenPayload>;
    login(loginDto: LoginDto): Promise<TokenPayload>;
    refreshTokens(refreshToken: string): Promise<TokenPayload>;
    logout(userId: string): Promise<void>;
    private generateTokens;
    private updateRefreshToken;
}
