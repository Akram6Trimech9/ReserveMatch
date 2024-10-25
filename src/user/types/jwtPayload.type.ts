import { Role } from "../enums/Role";

export type JwtPayload = {
    email: string;
    sub: string;
    role:Role
  };