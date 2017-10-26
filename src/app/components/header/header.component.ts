import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavbarPrimaryComponent } from './navbar-primary/navbar-primary.component';
import { NavbarSectionsComponent } from '../footer/navbar-sections/navbar-sections.component';
import { HeaderCommunicationService } from '../../services/component-communicators/header-communication.service';
import { SearchMenubarCommunicationService } from '../../services/component-communicators/search-menubar-communication.service';
import {MenusService} from '../../services/wordpress/menus.service';
import {MenuItem2} from '../../interfaces/menu';
import { ths_chapters } from '../../utils/ths-chapters';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RemoveLangParamPipe} from '../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../pipes/add-lang-to-slug.pipe';

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
  public subMenu: MenuItem2[];
  private showSubmenuIndex: number;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;

  constructor(private headerCommunicationService: HeaderCommunicationService,
              private searchMenubarCommunicationService: SearchMenubarCommunicationService,
              private menusService: MenusService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.showMenuMobile = false;
    this.showChaptersMobile = false;
    this.ths_chapters = ths_chapters;
    this.subMenu = [];
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
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

  showSubMenu(id, index) {
    this.subMenu = [];
    this.showSubmenuIndex = index;
    this.menusService.get_mainSubMenu(id, this.lang).subscribe((subMenu) => {
      this.subMenu = subMenu;
      console.log(this.subMenu);
      //const dropdown = submenu_item.lastChild.previousSibling;
      //dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
    });
  }

  hideSubMenu(i): void {
    this.showSubmenuIndex = -1;
  }

  goToPage(slug): void {
    if (this.lang === 'sv') {
      slug = this.removeLangParamPipe.transform(slug);
    }
    slug = this.addLangToSlugPipe.transform(slug, this.lang);
    this.router.navigate([slug]);
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
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
