import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMetod } from '@prisma/__generated__';
import * as argon2 from "argon2";


@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) {}
    
    public async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
              id
            },
            include: {
                accounts: true
            }
        })
        if(!user) {
            throw new NotFoundException('Пользователь не найден. Пожалуйста, проверьте введенные данные')
        }
        return user
    }

    public async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            },
            include: {
                accounts: true
            }
        })
        return user
    }

    public async create(email: string,
                        password: string,
                        displayName: string,
                        image: string,
                        method: AuthMetod,
                        isVerified: boolean) {
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: password? await argon2.hash(password): '',
                    displayName,
                    image,
                    method,
                    isVerified
                },
                include: {
                    accounts: true
                }
            })
            return user
        }
}
