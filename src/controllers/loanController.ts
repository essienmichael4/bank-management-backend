import { Gender, Loan, LoanDetail, PrismaClient } from '@prisma/client'
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
    return prisma.loan.findUnique({
        where: {account},
        include: {
            work:true,
            address: true,
            saving:true,
            guarantor: {include:{saving:true}},
            loanDetail: true,
            transactions:{
                include: {user:true}
            }
        }
    })
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
            transactions:{
                include: {user:true}
            }
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
export const grantLoan = (account:number, userid:number)=>{
    return prisma.loanDetail.update({
        where: {id: account},
        data: {
            grantedBy: Number(userid),
            state: "GRANTED"
        }
    })
}
export const closeLoanAccount = (account:string, userid:number)=>{
    console.log("Hi");
    
    return prisma.loan.update({
        where: {account: account},
        data: {
            balance: 0,
            status: "NOT_LOANED",
            loanDetail: {
                update:{
                    state: "CLOSED",
                    amount: 0,
                    interest: 0,
                    interestPercent: 0,
                    grantedBy: Number(userid),
                }
            }
        }
    })
}

export const loanedLoan = (account:string, userid:number)=>{

    return prisma.loan.update({
        where: {account: account},
        data: {
            status: "PENDING" ,
            loanDetail: { 
                update: {
                    grantedBy: Number(userid),
                    state: "GRANTED"
                }
            }
        }
    })
}

export const autoUpdateOfLoans = async ()=>{
    const loans = await prisma.loan.findMany({
        where:{status: {not: "PAID" || "NOT_LOANED"}},
        include:{loanDetail: {select:{
            dueAt: true
        }}}
    })

    const updatedLoans = loans.map(loan =>{
        let now = new Date()
        let tomorrow = new Date(now.setDate(now.getDate()+1))

        if (loan?.loanDetail!.dueAt >= now && loan?.loanDetail!.dueAt < tomorrow){
            loan.status = "DUE"
            return loan
        }

        if(loan?.loanDetail!.dueAt > tomorrow){
            loan.status = "OVERDUE"
            return loan
        }
    })

    updatedLoans.map(async loan => {
        await prisma.loan.update({where: {id: loan!.id}, data: {status: loan?.status}})
    })
    // prisma.loan.update(updatedLoans.map(loan =>{
    //     return  {where: { id: loan!.id}, data:{ status: loan!.status }}
    // }))

}