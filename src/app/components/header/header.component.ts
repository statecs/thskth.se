import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavbarPrimaryComponent } from './navbar-primary/navbar-primary.component';
import { NavbarSectionsComponent } from '../footer/navbar-sections/navbar-sections.component';
import { NavbarSecondaryComponent } from './navbar-secondary/navbar-secondary.component';
import { HeaderCommunicationService } from '../../services/component-communicators/header-communication.service';
import { SearchMenubarCommunicationService } from '../../services/component-communicators/search-menubar-communication.service';
import {MenusService} from '../../services/wordpress/menus.service';
import {MenuItem2} from '../../interfaces/menu';
import { ths_chapters } from '../../utils/ths-chapters';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('app_header') app_header: ElementRef;
  private topLevelMainMenu: MenuItem2[];
  public showMenuMobile: boolean;
  public showChaptersMobile: boolean;
  public ths_chapters: object[];

  constructor(private headerCommunicationService: HeaderCommunicationService,
              private searchMenubarCommunicationService: SearchMenubarCommunicationService,
              private menusService: MenusService) {
    this.showMenuMobile = false;
    this.showChaptersMobile = false;
    this.ths_chapters = ths_chapters;
  }

  toggleChaptersMobile(): void {
    (this.showChaptersMobile === true ? this.showChaptersMobile = false : this.showChaptersMobile = true);
  }

  toggleMenuMobile(): void {
    (this.showMenuMobile === true ? this.showMenuMobile = false : this.showMenuMobile = true);
  }

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
      /*if (arg === 'expend') {
        this.expendHeader();
      }else if (arg === 'collapse') {
        this.collapseHeader();
      }*/
    });

    this.menusService.getTopLevel_mainMenu()
        .subscribe(res => {
          this.topLevelMainMenu = res;
        });
  }

}
