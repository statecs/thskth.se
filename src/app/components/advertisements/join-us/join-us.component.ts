import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-join-us",
  templateUrl: "./join-us.component.html",
  styleUrls: ["./join-us.component.scss"]
})
export class JoinUsComponent implements OnInit, OnDestroy {
  public lang: string;
  public parentParamsSubscription: Subscription;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe(
      (params2: Params) => {
        this.lang = params2["lang"];
        if (typeof this.lang === "undefined") {
          this.lang = "en";
        } else if (this.lang === "sv") {
          this.lang = "sv";
        } else {
          this.lang = "en";
        }
      }
    );
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
