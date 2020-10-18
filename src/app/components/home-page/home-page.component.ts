import { Component, ElementRef, OnInit } from '@angular/core';
import { ProductDataService } from '../../services/productData.service';
import { UserDataService } from '../../services/userData.service';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  isUserLogIn: boolean;
  constructor(
    private elem: ElementRef,
    private productService: ProductDataService,
    private userService: UserDataService
  ) {}
  ngOnInit() {
    this.elem.nativeElement
      .querySelector('.hide-searchBox-container')
      .addEventListener(
        'wheel',
        () => {
          this.productService.hideSearchBoxObs.next([]);
        },
        { passive: true }
      );
    this.userService.userLogInObs.subscribe((result) => {
      this.isUserLogIn = result;
    });
  }
}
