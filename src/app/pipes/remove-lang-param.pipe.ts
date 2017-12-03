import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeLangParam'
})
export class RemoveLangParamPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let output = '';
    if (value.substring(value.length - 9) === '/?lang=en' || value.substring(value.length - 9) === '/?lang=sv') {
      output = value.substring(0, value.length - 9);
    }
    if (value.substring(value.length - 8) === '?lang=en' || value.substring(value.length - 8) === '?lang=sv') {
      output = value.substring(0, value.length - 8);
    }
    return output;
  }

}
