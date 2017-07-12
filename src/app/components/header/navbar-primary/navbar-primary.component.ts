import { Component, OnInit } from '@angular/core';
import {WordpressApiService} from '../../../services/wordpress/wordpress-api.service';
import {MenuItem} from '../../../interfaces/menu';

@Component({
  selector: 'app-navbar-primary',
  templateUrl: './navbar-primary.component.html',
  styleUrls: ['./navbar-primary.component.scss']
})
export class NavbarPrimaryComponent implements OnInit {
    private menu: MenuItem[];
    public language: string;
    constructor( private wordpressApiService: WordpressApiService ) { }

    ngOnInit() {
        this.wordpressApiService.getMenu('primary')
            .subscribe(res => {
                this.menu = res;
                console.log(res);
            });
    }

}
