import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavbarPrimaryComponent } from './navbar-primary/navbar-primary.component';
import { NavbarSectionsComponent } from '../footer/navbar-sections/navbar-sections.component';
import { NavbarSecondaryComponent } from './navbar-secondary/navbar-secondary.component';
import { HeaderCommunicationService } from '../../services/component-communicators/header-communication.service';
import { SearchMenubarCommunicationService } from '../../services/component-communicators/search-menubar-communication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('app_header') app_header: ElementRef;

  constructor(private headerCommunicationService: HeaderCommunicationService,
              private searchMenubarCommunicationService: SearchMenubarCommunicationService) { }

  showSearchMenubar(): void {
    this.searchMenubarCommunicationService.showSearchMenubar();
  }

  expendHeader() {
    this.app_header.nativeElement.style.top = '0';
  }

  collapseHeader() {
    this.app_header.nativeElement.style.top = '-150px';
  }

  ngOnInit() {
    this.headerCommunicationService.notifyObservable$.subscribe((arg) => {
      if (arg === 'expend') {
        this.expendHeader();
      }else if (arg === 'collapse') {
        this.collapseHeader();
      }
    });
  }

}
