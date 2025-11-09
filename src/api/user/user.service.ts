import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/userRespository';
import { CreateTeacherDto } from '../admin/users/Dto/users.dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository){}


    public async registerTeacher(dto:CreateTeacherDto ){ 

    }
}
