import { Injectable, ConflictException } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { User } from "./entities/user.entity"
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
  constructor(private usersRepository: Repository<User>) {}

  async create(userData: any) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    })

    if (existingUser) {
      throw new ConflictException("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    })

    return this.usersRepository.save(user)
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } })
  }

  async findById(id: string) {
    return this.usersRepository.findOne({ where: { id } })
  }

  async findAll(role?: string) {
    const query = this.usersRepository.createQueryBuilder("user")
    if (role) {
      query.where("user.role = :role", { role })
    }
    return query.getMany()
  }

  async update(id: string, userData: any) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10)
    }
    await this.usersRepository.update(id, userData)
    return this.findById(id)
  }

  async delete(id: string) {
    return this.usersRepository.delete(id)
  }
}
