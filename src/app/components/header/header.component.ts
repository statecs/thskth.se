import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavbarPrimaryComponent } from './navbar-primary/navbar-primary.component';
import { NavbarSectionsComponent } from '../footer/navbar-sections/navbar-sections.component';
import { NavbarSecondaryComponent } from './navbar-secondary/navbar-secondary.component';
import { HeaderCommunicationService } from '../../services/component-communicators/header-communication.service';
import { SearchMenubarCommunicationService } from '../../services/component-communicators/search-menubar-communication.service';
import {MenusService} from '../../services/wordpress/menus.service';
import {MenuItem2} from '../../interfaces/menu';
import { ths_chapters } from '../../utils/ths-chapters';
import {ActivatedRoute, Params, Router, RoutesRecognized} from '@angular/router';

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
  public placeholder: string;
  private lang: string;

  constructor(private headerCommunicationService: HeaderCommunicationService,
              private searchMenubarCommunicationService: SearchMenubarCommunicationService,
              private menusService: MenusService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
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

  setPlaceholder(): void {
    console.log(this.lang);
    if (this.lang === 'sv') {
      this.placeholder = 'Sök THS';
    }else {
      this.placeholder = 'Search THS and beyond';
    }
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this.setPlaceholder();
      this.menusService.getTopLevel_mainMenu(this.lang).subscribe(res => {
        this.topLevelMainMenu = res;
      });
    });

    this.headerCommunicationService.notifyObservable$.subscribe((arg) => {
      /*if (arg === 'expend') {
        this.expendHeader();
      }else if (arg === 'collapse') {
        this.collapseHeader();
      }*/
    });
  }

}
