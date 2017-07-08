import { Component, OnInit } from '@angular/core';
import {WordpressApiService} from '../../services/wordpress/wordpress-api.service';
import {MenuItem} from '../../interfaces/menu';
import { NavbarSectionsComponent } from '../header/navbar-sections/navbar-sections.component';
import { NavbarFooterComponent } from './navbar-footer/navbar-footer.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
