import { NgModule } from '@angular/core';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { HomeSlideshowComponent } from '../components/home-page/home-slideshow/home-slideshow.component';
import { RouterModule } from '@angular/router';
import { CategoryProductComponent } from '../components/category-products/category-product.component';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    HomePageComponent,
    HomeSlideshowComponent,
    CategoryProductComponent,
  ],
  imports: [RouterModule, SharedModule],
})
export class HomeModule {}
