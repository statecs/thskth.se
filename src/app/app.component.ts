import {Component, ElementRef, ViewChild, Inject} from '@angular/core';
import { AppCommunicationService } from './services/component-communicators/app-communication.service';
import { DOCUMENT } from '@angular/common';
import {ChatbotCommunicationService} from './services/component-communicators/chatbot-communication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('page') page: ElementRef;

  constructor( private appCommunicationService: AppCommunicationService,
               @Inject(DOCUMENT) private document: Document,
               private chatbotCommunicationService: ChatbotCommunicationService) {
    this.appCommunicationService.notifyObservable$.subscribe((arg) => {
      const pageStyle = this.page.nativeElement.style;
      if (arg === 'collapse') {
        pageStyle.top = '-' + (document.body.scrollTop || window.pageYOffset) + 'px';
        pageStyle.position = 'fixed';
      }else if (arg === 'show') {
        pageStyle.top = '0';
        pageStyle.position = 'absolute';
      }
    });
  }

  hideAllInfoBox(): void {
    this.chatbotCommunicationService.hideInfoBox();
  }
}
