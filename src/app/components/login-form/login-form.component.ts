import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserDataService } from '../../services/userData.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../product-form/product-form.component.css'],
})
export class LoginFormComponent {
  @ViewChild('form') form: NgForm;
  constructor(private userDataService: UserDataService) {}
  onSubmit() {
    this.userDataService
      .logIn(this.form.value.email, this.form.value.password)
      .subscribe((result) => {
        console.log(result);
      });
  }
}
