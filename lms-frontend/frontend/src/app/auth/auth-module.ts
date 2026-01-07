import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Login } from './login/login';
import { Register } from './register/register';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Login,        // 👈 standalone imported here
    Register
  ]
})
export class AuthModule { }
