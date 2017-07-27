import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardText'
})
export class CardTextPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    let output = value;

    if (value.length > arg) {
      output = value.substring(3, arg) + '...';
    }

    return output;
  }

}
