import { PrismaClient } from '@prisma/client'
import { Role } from '@prisma/client'
import { UpdateUser, User } from '../models/user.model'
const prisma = new PrismaClient()

export const createUser = (user:User)=>{

    return prisma.client.create({
        data:{
            firstname:user.firstName,
            lastname:user.lastName,
            othernames:user.otherNames,
            email:user.email,
            username:user.username,
            employeeId:user.employeeId,
            password:user.password,
            status:user.status,
            phone: user.phone,
            role: Role[user.role as keyof typeof Role],
            departments: {
                connectOrCreate: user!.departments?.map((dept) =>{
                    return {
                        where: {office: dept.office},
                        create: { office: dept.office, state: dept.state },
                    }
                })  
            }
        }, select:{firstname: true,departments: true}
    })
}

export const findUserByEmail = (email:string)=>{
    return prisma.client.findUnique({where:{email}, include: {departments:true}})
}

export const findUserByUsername = (username:string)=>{
    return prisma.client.findUnique({where:{username}, include: {departments:true}})
} 

export const findUserById = (id:number)=> {
    return prisma.client.findUnique({where:{id}, include: {departments:true}})  
}

export const findAllUsers = ()=>{
    return prisma.client.findMany({include: {departments:true}})
}

export const updateUser = (user:UpdateUser)=>{
    return prisma.client.update({where:{id: Number(user.id)},data:{
            firstname:user.firstName,
            lastname:user.lastName,
            othernames:user.otherNames,
            email:user.email,
            username:user.username,
            employeeId:user.employeeId,
            status:user.status,
            phone:user.phone,
            role: Role[user.role as keyof typeof Role]
    }})
}

export const updatePassword = (id:string, password:string) =>{
    return prisma.client.update({where: {id: Number(id)}, data:{
        password
    }})
} 

export const disableUser = (id:number)=>{
    return prisma.client.update({where:{id: Number(id)},data:{
            status: "DISABLED",
    }})
}

export const activateUser = (id:number)=>{
    return prisma.client.update({where:{id: Number(id)},data:{
            status: "ACTIVE",
    }})
}