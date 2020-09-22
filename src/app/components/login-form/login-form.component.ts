import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserDataService } from '../../services/userData.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent {
  @ViewChild('form') form: NgForm;
  userIcon = faUser;
  passwordIcon = faLock;
  wrongCredentials = false;
  constructor(private userDataService: UserDataService) {}
  onSubmit() {
    this.wrongCredentials = false;
    this.userDataService
      .logIn(this.form.value.email, this.form.value.password)
      .subscribe(
        (result) => {
          switch (result.message) {
            case 'email address dont match.':
              this.wrongCredentials = true;
              break;
            case "password doesn't match.":
              this.wrongCredentials = true;
              break;
            case 'successfully login.':
              console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
