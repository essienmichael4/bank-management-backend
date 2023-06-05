export interface SavingAccount{
    account: string,
    email: string,
    phone?: string,
    firstname: string,
    lastname: string,
    othernames?: string,
    dateOfBirth: string,
    registration: string,
    accountStatus: string,
    gender: string,

    work?:Work,
    address?:Address,
    nextOfKin?:NextOfKin,
    family?:Family

}

interface Work{
    employeeId?: string,
    occupation: string,
    company?: string,
    location?: string
}

interface Address{
residentialAddress: string,
homeTown: string,
city: string,
region: string,
country: string,
nationality: string
}

interface NextOfKin{
    firstname : string,
    lastname : string,
    othernames ?: string,
    relation : string,
    phone ?: string,
    occupation : string,
    residentialAddress : string
}

interface Family{
    maritalStatus: string,
    spouseName?: string,
    noOfChildren: string
}

export interface UpdateSavingAccount{
    account?: string,
    email?: string,
    phone?: string,
    firstname?: string,
    lastname?: string,
    othernames?: string,
    dateOfBirth: string,
    registration?: string,
    accountStatus?: string,
    gender?: string,

    work?:Work,
    address?:Address,
    nextOfKin?:NextOfKin,
    family?:Family

}