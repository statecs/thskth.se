import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/wordpress/pages.service';
import {Page} from "../../interfaces/page";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public page: Page;
  public parent_categories: any;

  constructor(private pagesService: PagesService) { }

  ngOnInit() {
    this.pagesService.getPageBySlug('contact').subscribe((page) => {
      console.log(page);
      this.page = page;
    });
  }

}
