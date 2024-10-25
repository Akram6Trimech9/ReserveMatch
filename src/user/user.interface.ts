import { Gender } from "./enums/Gender";
import { Role } from "./enums/Role";

export interface UserInterface {
  id?: string;  
  firstName: string;  
  lastName: string;  
  email: string;  
  dateOfBirth: Date;  
  gender: Gender;  
  phoneNumber: string;  
  image?: string;  
  password?: string;  
  country: string; 
  role: Role; 
  isEmailConfirmed?: boolean;  
  refreshToken?: string; 
  address: string; 
}
