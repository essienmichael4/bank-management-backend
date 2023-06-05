import { Client } from "@prisma/client";
import { Request} from "express";

export type AuthRequest = Request & {account?: Client}
