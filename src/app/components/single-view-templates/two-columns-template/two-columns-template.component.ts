import { Component, OnInit, Input } from '@angular/core';
import { Page } from '../../../interfaces/page';

@Component({
  selector: 'app-two-columns-template',
  templateUrl: './two-columns-template.component.html',
  styleUrls: ['./two-columns-template.component.scss']
})
export class TwoColumnsTemplateComponent implements OnInit {
  @Input() page_data: Page;

  constructor() { }

  ngOnInit() {
  }

}
