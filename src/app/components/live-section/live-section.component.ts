import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {HeaderCommunicationService} from '../../services/component-communicators/header-communication.service';

@Component({
  selector: 'app-live-section',
  templateUrl: './live-section.component.html',
  styleUrls: ['./live-section.component.scss']
})
export class LiveSectionComponent implements OnInit, OnDestroy {

  private lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private headerCommunicationService: HeaderCommunicationService) {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.pageNotFound = false;
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
    });
  }

  ngOnInit() {
    this.headerCommunicationService.tranparentHeader(false);
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
