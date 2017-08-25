import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  public warning: boolean;
  public notification: object;

  constructor(private wordpressApiService: WordpressApiService) {
    this.warning = false;
  }

  closeBar(): void {
    this.notification = null;
  }

  ngOnInit() {
    this.wordpressApiService.getNotification().subscribe((res) => {
      this.notification = res;
    });
  }

}
