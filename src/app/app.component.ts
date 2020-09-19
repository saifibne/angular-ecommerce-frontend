import { Component, OnInit } from '@angular/core';
import { UserDataService } from './services/userData.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private userDataService: UserDataService) {}
  ngOnInit() {
    this.userDataService.autoLogin();
  }

  title = 'ecommerce-frontend';
}
