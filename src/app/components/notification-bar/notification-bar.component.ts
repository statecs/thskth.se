import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  public warning: boolean;
  public showBar: boolean;

  constructor() {
    this.warning = false;
    this.showBar = true;
  }

  closeBar(): void {
    this.showBar = false;
  }

  ngOnInit() {
  }

}
