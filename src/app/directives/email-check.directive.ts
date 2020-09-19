import { Directive } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

@Directive({
  selector: '[emailCheck][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useClass: EmailCheckDirective,
      multi: true,
    },
  ],
})
export class EmailCheckDirective implements AsyncValidator {
  constructor(private http: HttpClient) {}
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.http
      .get<{ emailFound: string }>(
        `http://localhost:3000/email-search?email=${control.value}`
      )
      .pipe(
        take(1),
        map((result) => {
          if (result.emailFound === 'failed') {
            return null;
          } else if (result.emailFound === 'success') {
            return { existingEmail: true };
          }
        })
      );
  }
}
