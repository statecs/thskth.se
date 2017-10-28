import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardText'
})
export class CardTextPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    let output = value;
    if (value) {
      if (value.length > arg && value.substring(0, 1) === '<') {
        output = value.substring(3, arg) + '...';
      }else {
        output = value.substring(0, arg) + '...';
      }
    }
    return output;
  }

}
