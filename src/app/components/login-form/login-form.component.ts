import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserDataService } from '../../services/userData.service';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;
  userIcon = faUser;
  passwordIcon = faLock;
  wrongCredentials = false;
  logInSubscription: Subscription;
  constructor(
    private userDataService: UserDataService,
    private router: Router
  ) {}
  ngOnInit() {
    this.userDataService.showHeader.next(false);
    this.userDataService.showFooter.next(false);
  }

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
              this.userDataService.autoLogOut(new Date(result.expireTime));
              return this.router.navigate(['/']);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ngOnDestroy() {
    this.userDataService.showHeader.next(true);
    this.userDataService.showFooter.next(true);
  }
}
