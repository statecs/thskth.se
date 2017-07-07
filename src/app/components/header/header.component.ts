import { Component, OnInit } from '@angular/core';
import { NavbarPrimaryComponent } from './navbar-primary/navbar-primary.component';
import { NavbarSectionsComponent } from './navbar-sections/navbar-sections.component';
import { NavbarSecondaryComponent } from './navbar-secondary/navbar-secondary.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
