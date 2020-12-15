import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserDataService } from '../../services/userData.service';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css'],
})
export class SignupFormComponent implements OnInit, OnDestroy {
  @ViewChild('form') form: NgForm;
  deliveryIcon = faTruck;
  customerIcon = faHeadset;
  isSigningUp = false;
  constructor(private userDataService: UserDataService) {}
  ngOnInit() {
    this.userDataService.showHeader.next(false);
    this.userDataService.showFooter.next(false);
  }

  onSubmit() {
    this.isSigningUp = true;
    this.userDataService
      .signUp(
        this.form.value.name,
        this.form.value.email,
        this.form.value.password,
        this.form.value.companyName
      )
      .subscribe(() => {
        this.isSigningUp = false;
        this.form.reset();
      });
  }
  ngOnDestroy() {
    this.userDataService.showHeader.next(true);
    this.userDataService.showFooter.next(true);
  }
}
