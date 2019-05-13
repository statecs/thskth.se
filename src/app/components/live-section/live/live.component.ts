import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { TitleCommunicationService } from "../../../services/component-communicators/title-communication.service";

@Component({
  selector: "app-live",
  templateUrl: "./live.component.html",
  styleUrls: ["./live.component.scss"]
})
export class LiveComponent implements OnInit, OnDestroy {
  public slug: string;
  private lang: string;
  public paramsSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleCommunicationService: TitleCommunicationService
  ) {}

  goToPage(slug): void {
    if (
      slug.indexOf("http://") === 0 ||
      slug.indexOf("https://") === 0 ||
      slug.indexOf("www.") === 0
    ) {
      window.open(slug, "_black");
    } else {
      this.router.navigate([slug]);
    }
  }

  ngOnInit() {
    if (this.lang === "sv") {
      this.titleCommunicationService.setTitle("Sociala medier");
    } else {
      this.titleCommunicationService.setTitle("Social Media");
    }

    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.lang = params["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
