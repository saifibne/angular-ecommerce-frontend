import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { MatOptionModule } from '@angular/material/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { EmailCheckDirective } from './directives/email-check.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeSlideshowComponent } from './components/home-page/home-slideshow/home-slideshow.component';
import { HomeFooterComponent } from './components/home-page/home-footer/home-footer.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { HeaderComponent } from './components/header/header.component';
import { HideSearchBoxDirective } from './directives/hide-searchbox.directive';
import { CategoryProductComponent } from './components/category-products/category-product.component';
import { ShortTextPipe } from './pipes/shortText.pipe';
import { CartPageComponent } from './components/cart-page/cart-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductFormComponent,
    SignupFormComponent,
    LoginFormComponent,
    EmailCheckDirective,
    HideSearchBoxDirective,
    HomePageComponent,
    HomeSlideshowComponent,
    HomeFooterComponent,
    ProductPageComponent,
    HeaderComponent,
    CategoryProductComponent,
    ShortTextPipe,
    CartPageComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
