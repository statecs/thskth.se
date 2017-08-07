import { Component, OnInit } from '@angular/core';
import { ths_chapters } from '../../../utils/ths-chapters';

@Component({
  selector: 'app-navbar-sections',
  templateUrl: './navbar-sections.component.html',
  styleUrls: ['./navbar-sections.component.scss']
})
export class NavbarSectionsComponent implements OnInit {
  public ths_chapters: object[];

  constructor() {
    this.ths_chapters = ths_chapters;
  }

  ngOnInit() {
  }

}
