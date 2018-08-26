import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {HeaderCommunicationService} from '../../services/component-communicators/header-communication.service';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {TitleCommunicationService} from '../../services/component-communicators/title-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    public pageNotFound: boolean;
    private loading: boolean;
    public paramsSubscription: Subscription;
    private lang: string;
    userName: string;
    membershipExpireDate: string;
  constructor(private headerCommunicationService: HeaderCommunicationService,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private titleCommunicationService: TitleCommunicationService) {
      this.membershipExpireDate = '2019-09-30';
  }

  ngOnInit() {
      this.headerCommunicationService.tranparentHeader(false);
      this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
          this.pageNotFound = false;
          this.loading = true;
          this.lang = params['lang'];
          if (typeof this.lang === 'undefined') {
              this.lang = 'en';
          }else if (this.lang !== 'en' && this.lang !== 'sv') {
              this.pageNotFound = true;
              this.lang = 'en';
          }
          this.userName = this.lang = params['username'];
          this.titleCommunicationService.setTitle('User profile');
          this.loading = false;
      });
  }

}
