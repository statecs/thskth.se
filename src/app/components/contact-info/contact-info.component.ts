import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { CookieService, CookieOptions } from "ngx-cookie";
import { RestrictionService } from "../../services/wordpress/restriction.service";
import { NotificationBarCommunicationService } from "../../services/component-communicators/notification-bar-communication.service";

@Component({
  selector: "app-contact-info",
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.scss"]
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  public lang: string;
  public restriction: any;

  public paramsSubscription: Subscription;
  public restrictionUpdater: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _cookieService: CookieService,
    private restrictionService: RestrictionService,
    private notificationBarCommunicationService: NotificationBarCommunicationService
  ) {
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
    this.restriction = [];
    /* this.lang = this.activatedRoute.snapshot.data['lang'];
    if (typeof this.lang === 'undefined') {
      this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
        this.lang = params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
      });
    }*/
  }

  getRestrictions(): void {
    console.log("get");
    this.restrictionUpdater = this.restrictionService
      .getSingleRestriction("restrictions-karx", this.lang)
      .subscribe(
        res => {
          this.restriction = res;
        },
        error => {
          this.restriction = null;
          this.notificationBarCommunicationService.send_data(error);
        }
      );
  }

  ngOnInit() {
    this.getRestrictions();
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.restrictionUpdater) {
      this.restrictionUpdater.unsubscribe();
    }
  }
}
