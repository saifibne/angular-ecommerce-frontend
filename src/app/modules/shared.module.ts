import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShortTextPipe } from '../pipes/shortText.pipe';

@NgModule({
  declarations: [ShortTextPipe],
  imports: [CommonModule, FontAwesomeModule],
  exports: [CommonModule, FontAwesomeModule, ShortTextPipe],
})
export class SharedModule {}
