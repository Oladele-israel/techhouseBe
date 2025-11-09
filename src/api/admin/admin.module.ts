import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UserRepository } from './users/repository/user.reposiory';
import { DatabaseModule } from '../db/db.module';
import { UserService } from './users/users.service';
import { ClassesService } from './classes/classes.service';
import { ClassesController } from './classes/classes.controller';
import { SubjectsController } from './subjects/subjects.controller';
import { SubjectsService } from './subjects/subjects.service';

@Module({
  imports: [DatabaseModule], 
  providers: [UserService, UserRepository, ClassesService, SubjectsService],
  controllers: [UsersController, ClassesController, SubjectsController]
})
export class AdminModule {}
