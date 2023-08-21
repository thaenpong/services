import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  //----------------------------เข้าสู่ระบบ
  @HttpCode(HttpStatus.OK)
  @ApiTags('auth')
  @Public()
  @Post('login')
  @UsePipes(ValidationPipe)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  //--------------------------------- สมัครใหม่
  @HttpCode(HttpStatus.OK)
  @ApiTags('auth')
  @Post('signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  //------------------------------- ข้อมูลบัญชี
  @HttpCode(HttpStatus.OK)
  @ApiTags('auth')
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}