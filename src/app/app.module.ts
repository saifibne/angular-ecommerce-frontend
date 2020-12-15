import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppComponent } from './app.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { HomeFooterComponent } from './components/home-page/home-footer/home-footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AccountDropdownDirective } from './directives/account-dropdown.directive';
import { HomeModule } from './modules/home.module';
import { ProductAddModule } from './modules/productAdd.module';
import { SharedModule } from './modules/shared.module';
import { HideSearchBoxDirective } from './directives/hide-searchbox.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeFooterComponent,
    AccountDropdownDirective,
    HideSearchBoxDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressBarModule,
    FontAwesomeModule,
    HomeModule,
    ProductAddModule,
    SharedModule,
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
