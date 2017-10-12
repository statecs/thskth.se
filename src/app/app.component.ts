import {Component, ElementRef, ViewChild, Inject} from '@angular/core';
import { AppCommunicationService } from './services/component-communicators/app-communication.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('page') page: ElementRef;

  constructor( private appCommunicationService: AppCommunicationService,
               @Inject(DOCUMENT) private document: Document) {
    this.appCommunicationService.notifyObservable$.subscribe((arg) => {
      console.log(arg);
      console.log((window.pageYOffset || document.body.scrollTop));
      if (arg === 'collapse') {
        this.page.nativeElement.style.top = '-' + (document.body.scrollTop || window.pageYOffset) + 'px';
        this.page.nativeElement.style.position = 'fixed';
      }else if (arg === 'show') {
        this.page.nativeElement.style.position = 'absolute';
        this.page.nativeElement.style.top = '0';
      }
    });
  }
}
