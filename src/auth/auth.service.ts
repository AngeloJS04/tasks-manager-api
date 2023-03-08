import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jtw-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly authRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }


    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.authRepository.create({ username, password: hashedPassword });

        try {
            await this.authRepository.save(user);
        } catch (error) {
            console.log(error.code);
            if (error?.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;

        
        const user = await this.authRepository.findOne({
            where: { username }
        });
    
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };

            const accessToken: string = this.jwtService.sign(payload);
            return { accessToken };
        }
        else {
            throw new UnauthorizedException('Invalid credentials');
        }


    }
}
