import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistException extends HttpException {
    constructor(message: string = 'User already exists') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
