import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserDataService } from '../../services/userData.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['../product-form/product-form.component.css'],
})
export class SignupFormComponent {
  @ViewChild('form') form: NgForm;
  constructor(private userDataService: UserDataService) {}
  onSubmit() {
    this.userDataService
      .signUp(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password,
        this.form.value.companyName
      )
      .subscribe((result) => {
        console.log(result);
        this.form.reset();
      });
  }
}
