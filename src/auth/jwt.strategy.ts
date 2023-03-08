import { Injectable, UnauthorizedException } from "@nestjs/common";
import 'dotenv/config'
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserEntity } from "src/database/entities/user.entity";
import { Repository } from 'typeorm';
import { JwtPayload } from "./dto/jtw-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPayload): Promise<UserEntity> {
        const { username } = payload;
        const user: UserEntity = await this.userRepository.findOne({ where: { username } })
        if (!user) {
            throw new UnauthorizedException()
        }
        return user;
    }
}