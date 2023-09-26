import { PrismaClient } from '@prisma/client'
import { AccountStatus, Gender } from '@prisma/client'
import { SavingAccount, UpdateSavingAccount } from '../models/account.model'

const prisma = new PrismaClient()

export const getAccountById = (id:string) => {
    return prisma.saving.findUnique({where: { id: Number(id)}, 
        include :{ 
            nextOfKin: true,
            work: true,
            address:true,
            family:true,
            transactions:{
                include:{user:true}
            },
        }
    })
}

export const getAccountByAccountNumber = (account:string) => {
    return prisma.saving.findUnique({where: { account}})
}

export const getAllAccounts= () => {
    return prisma.saving.findMany({ 
        include :{ 
            nextOfKin: true,
            work: true,
            address:true,
            family:true
        }
    })
}

export const getAllAccountsForTransactions= () => {
    return prisma.saving.findMany({ 
        where:{status:{not: "CLOSED" || "DISABLED"}},
        include :{ 
            nextOfKin: true,
            work: true,
            address:true,
            family:true
        }
    })
}

export const createSavingsAccount = (account:SavingAccount)=>{
    const dateOfBirth = new Date(account.dateOfBirth)    
    
    return prisma.saving.create({data:{
            account:account.account,
            email: account.email,
            phone: account.phone,
            firstname: account.firstname,
            lastname: account.lastname,
            othernames: account.othernames,
            dateOfBirth: dateOfBirth,
            registration: Number(account.registration),
            status: AccountStatus[account.accountStatus as keyof typeof  AccountStatus],
            gender: Gender[account.gender.toUpperCase() as keyof typeof Gender],
            card: account.card,

            work:{create:{
                employeeId: account.work?.employeeId,
                occupation: account.work!.occupation,
                company: account.work?.company,
                location: account.work?.location,
                
            }},

            address: {create:{
                residentialAddress: account.address!.residentialAddress,
                homeTown: account.address!.homeTown,
                city: account.address!.city,
                region: account.address!.region,
                country: account.address!.country,
                nationality: account.address!.nationality,
                digital: account.address?.digital,
            }},

            nextOfKin:{create:{
                firstname : account.nextOfKin!.firstname,
                lastname : account.nextOfKin!.lastname,
                othernames : account.nextOfKin?.othernames,
                relation : account.nextOfKin!.relation,
                phone : account.nextOfKin?.phone,
                occupation : account.nextOfKin!.occupation,
                residentialAddress : account.nextOfKin!.residentialAddress
            }},

            family:{create:{
                maritalStatus: account.family!.maritalStatus,
                spouseName: account.family?.spouseName,
                noOfChildren: Number(account.family?.noOfChildren)
            }}
            
        },include:{
            family: true,
            nextOfKin:true,
            address:true,
            work:true
        }
    })
}

export const updateSavingsAccount = (id:string,account:UpdateSavingAccount)=>{ 
    
    return prisma.saving.update({where:{id: Number(id)},data:{
            account:account.account,
            email: account.email,
            phone: account.phone,
            firstname: account.firstname,
            lastname: account.lastname,
            othernames: account.othernames,
            dateOfBirth: new Date(account.dateOfBirth),
            registration: Number(account.registration),
            status: AccountStatus[account.accountStatus as keyof typeof  AccountStatus],
            gender: Gender[account.gender as keyof typeof Gender],

            work:{update:{
                employeeId: account.work?.employeeId,
                occupation: account.work!.occupation,
                company: account.work?.company,
                location: account.work?.location,
                
            }},

            address: {update:{
                residentialAddress: account.address!.residentialAddress,
                homeTown: account.address!.homeTown,
                city: account.address!.city,
                region: account.address!.region,
                country: account.address!.country,
                nationality: account.address!.nationality
            }},

            nextOfKin:{update:{
                firstname : account.nextOfKin!.firstname,
                lastname : account.nextOfKin!.lastname,
                othernames : account.nextOfKin?.othernames,
                relation : account.nextOfKin!.relation,
                phone : account.nextOfKin?.phone,
                occupation : account.nextOfKin!.occupation,
                residentialAddress : account.nextOfKin!.residentialAddress
            }},

            family:{update:{
                maritalStatus: account.family!.maritalStatus,
                spouseName: account.family?.spouseName,
                noOfChildren: Number(account.family!.noOfChildren)
            }}
        },include:{
            family: true,
            nextOfKin:true,
            address:true,
            work:true
        }
    })
}

export const countAccounts = ()=>{
    return prisma.saving.aggregate({
        _count:{id:true}
    })
}

export const getLastAccountNumber = ()=>{
    return prisma.saving.findMany({
        select: {account:true},
        orderBy: {id: "desc"},
        take: 1
    })
}

export const closeSavingAccount = (account:string)=>{
    console.log("Hi");
    
    return prisma.saving.update({
        where: {account: account},
        data: {
            balance: 0,
            status: "CLOSED",
        }
    })
}

export const disableSavingAccount = (account:string)=>{
    console.log("Hi");
    
    return prisma.saving.update({
        where: {account: account},
        data: {
            status: "DISABLED",
        }
    })
}

export const activateSavingAccount = (account:string)=>{
    console.log("Hi");
    
    return prisma.saving.update({
        where: {account: account},
        data: {
            status: "ACTIVE",
        }
    })
}