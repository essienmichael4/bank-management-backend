export interface User{
    id?:string,
    firstName:string,
    lastName:string,
    otherNames?:string,
    email:string,
    password:string,
    username:string,
    employeeId:string, 
    role:string,
    status:string,
    phone?:string,
    departments?:Department[],
    tokens?:Token[]
}

interface Department{
    office:string,
    state:string,
    users:User[]
}

interface Token{
    type:string,
    isValid:boolean,
    expiresAt:string,
    userId:number
}

export interface UpdateUser{
    id?:string,
    firstName?:string,
    lastName?:string,
    otherNames?:string,
    email?:string,
    username?:string,
    employeeId?:string, 
    role?:string,
    status?:string,
    phone?:string,
}

export interface PasswordRequest{
    id?:string,
    email: string,
    previousPassword?:string,
    password?:string,
    repeatPassword?:string,
}