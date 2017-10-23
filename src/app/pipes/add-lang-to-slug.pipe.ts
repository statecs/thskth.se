import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addLangToSlug'
})
export class AddLangToSlugPipe implements PipeTransform {

  transform(value: any, lang: any): any {
    let output = '';
    if (lang === 'sv') {
      output = '/sv' + value;
    }else if (lang === 'en') {
      output = '/en' + value;
    }
    return output;
  }

}
