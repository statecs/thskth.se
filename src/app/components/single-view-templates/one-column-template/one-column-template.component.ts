import { Component, OnInit, Input } from '@angular/core';
import { Page } from '../../../interfaces/page';
import format from 'date-fns/format/index';

@Component({
  selector: 'app-one-column-template',
  templateUrl: './one-column-template.component.html',
  styleUrls: ['./one-column-template.component.scss']
})
export class OneColumnTemplateComponent implements OnInit {
  @Input() page_data: Page;

  formatDate(created_time): string {
    return format(created_time, 'YYYY-MM-DD');
  }
 
  constructor() {
  }

  ngOnInit() {
  }

}
