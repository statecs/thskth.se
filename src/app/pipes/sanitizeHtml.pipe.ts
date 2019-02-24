import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeHtml',
    pure: false
})
export class SanitizeHtmlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {
    }

    transform(value: string, args?: any): any {
        return this.domSanitizer.bypassSecurityTrustHtml(value);
    }
}
