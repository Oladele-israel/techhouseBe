import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UserRepository } from './users/repository/user.reposiory';
import { DatabaseModule } from '../db/db.module';
import { UserService } from './users/users.service';
import { ClassesService } from './classes/classes.service';
import { ClassesController } from './classes/classes.controller';
import { SubjectsController } from './subjects/subjects.controller';
import { SubjectsService } from './subjects/subjects.service';
import { ExamsService } from './exams/exams.service';
import { ExamsController } from './exams/exams.controller';
import { ClassRepository } from './classes/repository/class.repository';
import { SubjectRepository } from './subjects/repository/subject.repository';

@Module({
  imports: [DatabaseModule], 
  providers: [UserService, UserRepository, ClassesService, SubjectsService, ExamsService, ClassRepository, SubjectRepository],
  controllers: [UsersController, ClassesController, SubjectsController, ExamsController]
})
export class AdminModule {}
