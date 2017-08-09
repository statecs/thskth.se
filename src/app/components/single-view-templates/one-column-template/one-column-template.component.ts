import { Component, OnInit, Input } from '@angular/core';
import { Page } from '../../../interfaces/page';

@Component({
  selector: 'app-one-column-template',
  templateUrl: './one-column-template.component.html',
  styleUrls: ['./one-column-template.component.scss']
})
export class OneColumnTemplateComponent implements OnInit {
  @Input() page_data: Page;

  constructor() { }

  ngOnInit() {
  }

}
