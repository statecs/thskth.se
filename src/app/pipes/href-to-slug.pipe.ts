import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hrefToSlug'
})
export class HrefToSlugPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let output = '';
    if (value.substring(0, 7) === 'http://') {
      output = value.substring(14);
    }else if (value.substring(0, 8) === 'https://') {
      output = value.substring(15);
    }
    return output;
  }

}
