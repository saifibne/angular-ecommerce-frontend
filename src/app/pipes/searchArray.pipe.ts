import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchArray',
})
export class SearchArrayPipe implements PipeTransform {
  transform(value: any[], input: string): any {
    if (input && input.length > 0) {
      const searchText = new RegExp(`${input}`, 'i');
      let newArray;
      newArray = value.filter((each) => {
        return each.name.match(searchText);
      });
      return newArray;
    } else {
      return value;
    }
  }
}
