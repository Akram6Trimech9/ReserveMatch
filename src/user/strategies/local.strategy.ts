import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserService } from "../services/user.service";
import { UserInterface } from "../user.interface";
  

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    
    constructor( private   authService: UserService){
        super({
            usernameField:'email',
        });  
             
    }

    async validate(email: string, password: string):Promise<UserInterface>{
         
       const user = await this.authService.validateUser(email,password) ; 
         if(!user){
             throw new UnauthorizedException() ; 
         }
         return user; 
    }
}