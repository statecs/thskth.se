import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeLangParam'
})
export class RemoveLangParamPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return '/sv' + value.substring(0, value.length - 8);
  }

}
