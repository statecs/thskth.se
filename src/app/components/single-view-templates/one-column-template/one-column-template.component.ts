import { Component, OnInit, Input } from "@angular/core";
import { Page } from "../../../interfaces-and-classes/page";
import * as format from "date-fns/format";
import {SanitizeHtmlPipe} from '../../../pipes/sanitizeHtml.pipe';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: "app-one-column-template",
  templateUrl: "./one-column-template.component.html",
  styleUrls: ["./one-column-template.component.scss"]
})
export class OneColumnTemplateComponent implements OnInit {
  page_data: Page;
  sanitizeHtmlPipe: SanitizeHtmlPipe;

  @Input('page_data') set pageData(page: Page) {
    page.content = this.sanitizeHtmlPipe.transform(page.content);
    this.page_data = page;
  }

  formatDate(created_time): string {
    return format(created_time, "YYYY-MM-DD");
  }

  constructor(private domSanitizer: DomSanitizer) {
      this.sanitizeHtmlPipe = new SanitizeHtmlPipe(domSanitizer);
  }

  ngOnInit() {}
}
