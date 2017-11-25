import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {RelatedLink} from '../../../interfaces/page';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-related-links',
  templateUrl: './related-links.component.html',
  styleUrls: ['./related-links.component.scss']
})
export class RelatedLinksComponent implements OnInit, OnDestroy {

  @Input() links: RelatedLink[];
  public lang: string;
  public parentParamsSubscription: Subscription;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe((params2: Params) => {
      this.lang = params2['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
  }

  goToPage(url:  string): void {
    if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
      window.open(url, '_blank');
    }else {
      if (url.substring(0, 1) === '/') {
        this.router.navigate(['/' + this.lang + url]);
      }else {
        this.router.navigate(['/' + this.lang + '/' + url]);
      }
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.parentParamsSubscription) {
      this.parentParamsSubscription.unsubscribe();
    }
  }
}
