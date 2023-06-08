import { Client } from "@prisma/client";
import { Request} from "express";

export type AuthRequest = Request & {tokenAccount?: Client}
