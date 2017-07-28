import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { Card } from '../../interfaces/card';

@Component({
  selector: 'app-cards-social-container',
  templateUrl: './cards-social-container.component.html',
  styleUrls: ['./cards-social-container.component.scss']
})
export class CardsSocialContainerComponent implements OnInit {
  public cards: Card[];

  constructor( private wordpressApiService: WordpressApiService ) { }

  getBgUrl(img_url): string {
    return 'url("' + img_url + '")';
  }

  ngOnInit() {
    /*this.wordpressApiService.getCards()
        .subscribe(res => {
          console.log(res);
          this.cards = res;
        });*/
  }

}
