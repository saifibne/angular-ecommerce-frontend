import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HideSearchBoxDirective } from '../directives/hide-searchbox.directive';
import { ShortTextPipe } from '../pipes/shortText.pipe';

@NgModule({
  declarations: [HideSearchBoxDirective, ShortTextPipe],
  imports: [CommonModule, FontAwesomeModule],
  exports: [
    CommonModule,
    FontAwesomeModule,
    HideSearchBoxDirective,
    ShortTextPipe,
  ],
})
export class SharedModule {}
