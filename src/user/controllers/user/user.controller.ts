import {
    Controller,
    Delete,
    Get,
    Param,
    Query,
    UsePipes,
    HttpStatus,
    HttpException,
  } from '@nestjs/common';
  import { UserService } from 'src/user/services/user.service';
  import { ApiTags, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
  import { ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
  
  @ApiTags('User')
  @Controller('user')
  export class UserController {
    constructor(private readonly usersService: UserService) {}
  
    @Get('/')
    @ApiResponse({ status: 200, description: 'Get all users' })
    async findAll() {
      return await this.usersService.findAll();
    }
  
    @Get('/search')
    @ApiQuery({ name: 'letter', required: true, description: 'Letter to search users' })
    @ApiResponse({ status: 200, description: 'Search users by letter' })
    async searchUsers(@Query('letter') letter: string) {
      return await this.usersService.searchUsers(letter);
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', required: true, description: 'User ID (UUID)' })
    @ApiResponse({ status: 200, description: 'Get user by ID' })
    async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
      const user = await this.usersService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    }
  
    @Get('/email/:email')
    @ApiParam({ name: 'email', required: true, description: 'User email' })
    @ApiResponse({ status: 200, description: 'Get user by email' })
    async findByEmail(@Param('email') email: string) {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return user;
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', required: true, description: 'User ID (UUID)' })
    @ApiResponse({ status: 200, description: 'User successfully deleted' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async remove(@Param('id', new ParseUUIDPipe()) id: string) {
      const result = await this.usersService.remove(id);
      if (!result) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'User successfully deleted' };
    }
  }
  