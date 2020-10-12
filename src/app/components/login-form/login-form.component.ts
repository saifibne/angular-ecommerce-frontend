import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserDataService } from '../../services/userData.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  logInSubscription: Subscription;
  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) {}
  onSubmit() {
    this.wrongCredentials = false;
    this.logInSubscription = this.userDataService
      .logIn(this.form.value.email, this.form.value.password)
      .subscribe(
        (result) => {
          console.log(result);
          switch (result.message) {
            case 'email address dont match.':
              this.wrongCredentials = true;
              break;
            case "password doesn't match.":
              this.wrongCredentials = true;
              break;
            case 'successfully login.':
              // return this.router.navigate(['../'], {
              //   relativeTo: this.currentRoute,
              // });
              window.history.back();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
