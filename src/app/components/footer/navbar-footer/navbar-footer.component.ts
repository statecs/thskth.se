import { Component, OnInit } from '@angular/core';
import {MenuItem} from '../../../interfaces/menu';
import {MenusService} from '../../../services/wordpress/menus.service';
import {Router, RoutesRecognized} from '@angular/router';

@Component({
  selector: 'app-navbar-footer',
  templateUrl: './navbar-footer.component.html',
  styleUrls: ['./navbar-footer.component.scss']
})
export class NavbarFooterComponent implements OnInit {

  private footer_menu: MenuItem[];
  private lang: string;

  constructor( private menusService: MenusService, private router: Router) {
  }

  ngOnInit() {
      this.router.events.subscribe(val => {
          if (val instanceof RoutesRecognized) {
              this.lang = val.state.root.firstChild.params['lang'];
              if (typeof this.lang === 'undefined') {
                  this.lang = 'en';
              }
              console.log(this.lang);
          }
          this.menusService.getMenu('footer', this.lang).subscribe(res => {
              this.footer_menu = res;
          });
      });
  }

}
