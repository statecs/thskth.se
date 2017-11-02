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
  private scrollTop: number;
  public online: boolean = navigator.onLine;

  constructor( private appCommunicationService: AppCommunicationService,
               @Inject(DOCUMENT) private document: Document,
               private chatbotCommunicationService: ChatbotCommunicationService) {
    window.addEventListener('online', () => {this.online = true; });
    window.addEventListener('offline', () => {this.online = false; });
    console.log(this.online);
    this.appCommunicationService.notifyObservable$.subscribe((arg) => {
      if (this.page) {
        const pageStyle = this.page.nativeElement.style;
        if (arg === 'collapse') {
          this.scrollTop = (document.body.scrollTop || window.pageYOffset);
          pageStyle.top = '-' + this.scrollTop + 'px';
          pageStyle.position = 'fixed';
          window.scrollTo(0, 0);
        }else if (arg === 'show') {
          pageStyle.position = 'absolute';
          pageStyle.top = '0';
          const self = this;
          setTimeout(function () {
            window.scrollTo(0, self.scrollTop);
          }, 3);
        }
      }
    });
  }

  hideAllInfoBox(): void {
    this.chatbotCommunicationService.hideInfoBox();
  }
}
