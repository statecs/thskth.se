import {Component, ElementRef, ViewChild} from '@angular/core';
import { AppCommunicationService } from './services/component-communicators/app-communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('page') page: ElementRef;

  constructor( private appCommunicationService: AppCommunicationService) {
    this.appCommunicationService.notifyObservable$.subscribe((arg) => {
      if (arg === 'collapse') {
        this.page.nativeElement.style.position = 'fixed';
      }else if (arg === 'show') {
        this.page.nativeElement.style.position = 'absolute';
      }
    });
  }
}
