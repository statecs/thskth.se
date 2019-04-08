import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { CookieService, CookieOptions } from "ngx-cookie";

@Component({
  selector: "app-join-us",
  templateUrl: "./join-us.component.html",
  styleUrls: ["./join-us.component.scss"]
})
export class JoinUsComponent implements OnInit, OnDestroy {
  public lang: string;
  public parentParamsSubscription: Subscription;

  constructor(
    private router: Router,
    private _cookieService: CookieService,
    private activatedRoute: ActivatedRoute
  ) {
    if (this._cookieService.get("language") == "sv") {
      this.lang = "sv";
    } else {
      this.lang = "en";
    }
  }

  goToPage(slug): void {
    this.router.navigate(["/" + slug]);
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.parentParamsSubscription) {
      this.parentParamsSubscription.unsubscribe();
    }
  }
}
