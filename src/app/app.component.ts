import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UserDataService } from './services/userData.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  isLogIn = false;
  showHeader = true;
  fixedHeader = false;
  showFooter = true;
  constructor(
    private userDataService: UserDataService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.userDataService.autoLogin();
    this.userDataService.userLogInObs.subscribe((result) => {
      this.isLogIn = result;
    });
    this.userDataService.showHeader.subscribe((result) => {
      this.showHeader = result;
      this.cd.detectChanges();
    });
    this.userDataService.fixedHeader.subscribe((result) => {
      this.fixedHeader = result;
      this.cd.detectChanges();
    });
    this.userDataService.showFooter.subscribe((result) => {
      this.showFooter = result;
      this.cd.detectChanges();
    });
  }

  title = 'ecommerce-frontend';
}
