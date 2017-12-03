import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeLangParam'
})
export class RemoveLangParamPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    console.log(value.substring(0, value.length - 9));
    return value.substring(0, value.length - 9);
  }

}
