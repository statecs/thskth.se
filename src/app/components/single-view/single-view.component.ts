import { Component, OnInit, Input } from '@angular/core';
import { Page } from '../../interfaces/page';
import { PagesService } from '../../services/wordpress/pages.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-single-view',
  templateUrl: './single-view.component.html',
  styleUrls: ['./single-view.component.scss']
})
export class SingleViewComponent implements OnInit {

  @Input() page: Page;
  public slug: string;
  private lang: string;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute) { }

  getPageBySlug() {
    this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
      console.log(page);
      this.page = page;
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['single_page_slug'];
      console.log(this.slug);
      this.activatedRoute.parent.params.subscribe((params2: Params) => {
        this.lang = params2['lang'];
        console.log(this.lang);
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
        this.getPageBySlug();
      });

    });
  }

}
