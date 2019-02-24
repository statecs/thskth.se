import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeUrl',
    pure: false
})
export class SanitizeUrlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {
    }

    transform(value: string, args?: any): any {
        return this.domSanitizer.bypassSecurityTrustUrl(value);
    }
}
