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

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute) { }

  getPageBySlug(slug) {
    this.pagesService.getPageBySlug(slug).subscribe((page) => {
      console.log(page);
      this.page = page;
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.slug = params['single_page_slug'];
      console.log(this.slug);
      this.getPageBySlug(this.slug);
    });
  }

}
