import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hrefToSlug'
})
export class HrefToSlugPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.substring(14);
  }

}
