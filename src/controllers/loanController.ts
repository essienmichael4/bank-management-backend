import { Gender, PrismaClient } from '@prisma/client'
import { LoanStatus , LoanState} from '@prisma/client'
import { LoanAccount } from '../models/account.model'

const prisma = new PrismaClient()

export const createLoan = (loan:LoanAccount)=>{
    //loan balance calculation
    const loanAmount = Number(loan.loanDetail.amount)
    const loanInterest = Number(loan.loanDetail.interestPercent)
    const interest = loanAmount * (loanInterest / 100)
    const balance = loanAmount + interest


    loan.balance = balance.toString()
    loan.loanDetail.interest = interest.toString()

    //Guarantors amount calculation
    const numberOfGuarantors = loan.guarantor.length
    const amountGuaranted = loanAmount / numberOfGuarantors

    return prisma.loan.create({data:{
        account:loan.account,
        email: loan.email,
        phone: loan.phone,
        firstname: loan.firstname,
        lastname: loan.lastname,
        othernames: loan.othernames,
        dateOfBirth: new Date(loan.dateOfBirth),
        purpose: loan.purpose,
        balance: Number(loan.balance),
        gender: Gender[loan.gender as keyof typeof Gender],
        status: LoanStatus[loan.status as keyof typeof LoanStatus],        
        saving:{connect:{id: Number(loan.sponsor)}},
        
        work:{
            create:{
                employeeId: loan.work?.employeeId,
                occupation: loan.work!.occupation,
                company: loan.work?.company,
                location: loan.work?.location,
            }
        },
        address:{
            create:{
                residentialAddress: loan.address!.residentialAddress,
                homeTown: loan.address!.homeTown,
                city: loan.address!.city,
                region: loan.address!.region,
                country: loan.address!.country,
                nationality: loan.address!.nationality
            }
        },
        guarantor:{
            create: loan.guarantor.map((g)=>{
                    return {
                        amount:Number(amountGuaranted),
                        saving:{
                            connect: {id: Number(g.savingId)}}
                    }
                })            
        },
        loanDetail:{
            create:{
                amount: Number(loan.loanDetail.amount),
                interest: Number(loan.loanDetail.interest),
                interestPercent: Number(loan.loanDetail.interestPercent),
                appliedAt: new Date(loan.loanDetail.appliedAt),
                dueAt: new Date(loan.loanDetail.dueAt),
                modeOfPayment: loan.loanDetail.modeOfPayment,
                state: LoanState[loan.loanDetail.state as keyof typeof LoanState],
                // user: {connect:{ id: Number(loan.loanDetail?.grantedBy)}}
            }
        }
    }})
}

export const getLoanByAccountNumber = (account:string)=>{
    return prisma.loan.findUnique({where: {account}})
}

export const getLoanByEmail = (email:string)=>{
    return prisma.loan.findMany({where: {email}})
}

export const getLoanById = (id:string)=>{
    return prisma.loan.findUnique({
        where: {id: Number(id)},
        include: {
            work:true,
            address: true,
            saving:true,
            guarantor: {include:{saving:true}},
            loanDetail: true,
            transactions:true
        }
    })
}

export const getAllLoans = ()=>{
    return prisma.loan.findMany({include: {loanDetail:true}})
}

export const getAllDueLoans = ()=>{
    return prisma.loan.findMany({where:{
        status: LoanStatus["DUE"]
    }})
}

export const getAllOverdueLoans = ()=>{
    return prisma.loan.findMany({where:{
        status: LoanStatus["OVERDUE"]
    }})
}

export const getAllPendingLoans = ()=>{
    return prisma.loan.findMany({where:{
        status: LoanStatus["PENDING"]
    }})
}

export const getAllPaidLoans = ()=>{
    return prisma.loan.findMany({where:{
        status: LoanStatus["PAID"]
    }})
}

export const updateLoan = (id:string, loan:LoanAccount)=>{
    return prisma.loan.update({where: { id: Number(id) },data:{
        account:loan.account,
        email: loan.email,
        phone: loan.phone,
        firstname: loan.firstname,
        lastname: loan.lastname,
        othernames: loan.othernames,
        dateOfBirth: new Date(loan.dateOfBirth),
        purpose: loan.purpose,
        gender: Gender[loan.gender as keyof typeof Gender],
        status: LoanStatus[loan.status as keyof typeof LoanStatus],
        sponser: Number(loan.sponsor),
        
        work:{
            update:{
                employeeId: loan.work?.employeeId,
                occupation: loan.work!.occupation,
                company: loan.work?.company,
                location: loan.work?.location,
            }
        },
        address:{
            update:{
                residentialAddress: loan.address!.residentialAddress,
                homeTown: loan.address!.homeTown,
                city: loan.address!.city,
                region: loan.address!.region,
                country: loan.address!.country,
                nationality: loan.address!.nationality
            }
        },
        loanDetail:{
            update:{
                amount: Number(loan.loanDetail.amount),
                interest: Number(loan.loanDetail.interest),
                interestPercent: Number(loan.loanDetail.interestPercent),
                appliedAt: new Date(loan.loanDetail.appliedAt),
                dueAt: new Date(loan.loanDetail.dueAt),
                modeOfPayment: loan.loanDetail.modeOfPayment,
                state: LoanState[loan.loanDetail.state as keyof typeof LoanState],
                grantedBy: Number(loan.loanDetail.grantedBy)
            }
        }
    }})
}

export const countLoans = ()=>{
    return prisma.loan.aggregate({
        _count:{id:true}
    })
}

export const getLastAccountNumber = ()=>{
    return prisma.loan.findMany({
        select: {account:true},
        orderBy: {id: "desc"},
        take: 1
    })
}