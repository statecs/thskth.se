import { Component, OnInit } from '@angular/core';
import {MenuItem} from '../../../interfaces/menu';
import {MenusService} from '../../../services/wordpress/menus.service';

@Component({
  selector: 'app-navbar-footer',
  templateUrl: './navbar-footer.component.html',
  styleUrls: ['./navbar-footer.component.scss']
})
export class NavbarFooterComponent implements OnInit {

  private footer_menu: MenuItem[];

  constructor( private menusService: MenusService) { }

  ngOnInit() {
    this.menusService.getMenu('footer')
        .subscribe(res => {
          this.footer_menu = res;
          //console.log(res);
        });
  }

}
