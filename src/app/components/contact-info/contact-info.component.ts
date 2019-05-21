import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { CookieService, CookieOptions } from "ngx-cookie";

@Component({
  selector: "app-contact-info",
  templateUrl: "./contact-info.component.html",
  styleUrls: ["./contact-info.component.scss"]
})
export class ContactInfoComponent implements OnInit, OnDestroy {
  public lang: string;

  public paramsSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _cookieService: CookieService
  ) {
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
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

  ngOnInit() {}

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
