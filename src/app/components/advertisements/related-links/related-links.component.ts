import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { RelatedLink } from "../../../interfaces-and-classes/page";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { RemoveLangParamPipe } from "../../../pipes/remove-lang-param.pipe";
import { CookieService, CookieOptions } from "ngx-cookie";

@Component({
  selector: "app-related-links",
  templateUrl: "./related-links.component.html",
  styleUrls: ["./related-links.component.scss"]
})
export class RelatedLinksComponent implements OnInit, OnDestroy {
  @Input() links: RelatedLink[];
  public lang: string;
  public parentParamsSubscription: Subscription;
  private removeLangParamPipe: RemoveLangParamPipe;

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
    this.removeLangParamPipe = new RemoveLangParamPipe();
  }

  goToPage(url: string): void {
    if (
      url.substring(0, 7) === "http://" ||
      url.substring(0, 8) === "https://"
    ) {
      window.open(url, "_blank");
    } else {
      let slug = url;
      if (
        slug.substring(slug.length - 9) === "/?lang=en" ||
        slug.substring(slug.length - 9) === "/?lang=sv"
      ) {
        slug = this.removeLangParamPipe.transform(slug);
      }
      if (
        slug.substring(slug.length - 8) === "?lang=en" ||
        slug.substring(slug.length - 8) === "?lang=sv"
      ) {
        slug = this.removeLangParamPipe.transform(slug);
      }
      if (slug.substring(0, 1) === "/") {
        if (
          slug.substring(0, 4) === "/en/" ||
          slug.substring(0, 4) === "/sv/"
        ) {
          this.router.navigate([slug]);
        } else {
          this.router.navigate(["/" + this.lang + slug]);
        }
      } else {
        if (slug.substring(0, 3) === "en/" || slug.substring(0, 3) === "sv/") {
          this.router.navigate(["/" + slug]);
        } else {
          this.router.navigate(["/" + this.lang + "/" + slug]);
        }
      }
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.parentParamsSubscription) {
      this.parentParamsSubscription.unsubscribe();
    }
  }
}
