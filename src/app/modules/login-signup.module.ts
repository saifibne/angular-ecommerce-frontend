import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SignupFormComponent } from '../components/signup-form/signup-form.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { EmailCheckDirective } from '../directives/email-check.directive';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [SignupFormComponent, LoginFormComponent, EmailCheckDirective],
  imports: [
    FormsModule,
    RouterModule.forChild([
      { path: 'signup', component: SignupFormComponent },
      { path: 'login', component: LoginFormComponent },
    ]),
    SharedModule,
  ],
})
export class LoginSignupModule {}
