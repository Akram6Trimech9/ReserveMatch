import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enums/Gender";
import { Role } from "../enums/Role";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true }) 
    email: string;

    @Column({ type: "enum", enum: Gender })  
    gender: Gender;

    @Column({ type: "date", nullable: true })  
    dateOfBirth: Date;

    @Column({ nullable: true }) 
    phoneNumber: string;

    @Column({ nullable: true }) 
    image: string;

    @Column({ default: false })
    isEmailConfirmed: boolean;

    @Column({ nullable: true })  
    refreshToken: string;

    @Column()
    password: string;

    @Column()
    country: string;

    @Column({ type: "enum", enum: Role })  
    role: Role;

    @Column({ nullable: true })  
    address: string;
}
