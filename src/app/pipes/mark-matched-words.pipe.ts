import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'markMatchedWords'
})
export class MarkMatchedWordsPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    let output = '';
    if (arg !== '' && value) {
      const outputList = [];
      const wordsList = value.split(' ');
      wordsList.forEach(function (item, index) {
        const indexOf = item.toLowerCase().indexOf(arg.toLowerCase());
        if ( indexOf > -1) {
          const k = item.substring(indexOf, item.length);
          const found = k.substring(0, arg.length);
          const replaced = item.replace(found, '<strong>' + found + '</strong>');
          outputList.push(replaced);
        }else {
          outputList.push(item);
        }
      });
      output = outputList.join(' ');
    }else {
      output = value;
    }
    return output;
  }

}
