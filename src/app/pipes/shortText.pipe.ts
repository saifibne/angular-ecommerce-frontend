import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortText',
})
export class ShortTextPipe implements PipeTransform {
  transform(value: any, length: number): any {
    if (value.length > length) {
      return value.substr(0, length) + '...';
    } else {
      return value;
    }
  }
}
