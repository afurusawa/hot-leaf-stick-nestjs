import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    this.logger.debug(`Attempting to validate user with email: ${email}`);
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      this.logger.debug(`No user found with email: ${email}`);
      return null;
    }

    this.logger.debug(`User found, verifying password...`);
    const isPasswordValid = await argon2.verify(user.password, password);
    this.logger.debug(`Password verification result: ${isPasswordValid}`);

    if (isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user; // explicitly remove password from user object
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await argon2.hash(registerDto.password);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // explicitly remove password from user object
    return result;
  }
}
