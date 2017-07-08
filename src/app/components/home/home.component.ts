import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor( private wordpressApiService: WordpressApiService) { }

  ngOnInit() {
    this.wordpressApiService.getCards()
        .subscribe(res => {
          console.log(res);
        });
  }

}
