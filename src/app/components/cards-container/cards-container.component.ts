import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { Card } from '../../interfaces/card';

@Component({
  selector: 'app-cards-container',
  templateUrl: './cards-container.component.html',
  styleUrls: ['./cards-container.component.scss']
})
export class CardsContainerComponent implements OnInit {
  public cards: Card[];
  public arranged_cards: Card[];
    public one_sixth_cards_array: Card[][];
    public one_third_half_array: Card[][];

  constructor( private wordpressApiService: WordpressApiService ) { }

    getBgUrl(card: any): string {
      let url = '';
      if (typeof card.background_image.sizes !== 'undefined') {
          url = card.background_image.sizes.medium_large;
      }
      return url;
    }

    changeBGColor(card: any): any {
      if (typeof card.background_color === 'undefined' || typeof card.background_image.sizes !== 'undefined') {
          return {};
      }else {
          return { 'background-color': card.background_color };
      }
    }

  ngOnInit() {
      const self = this;
      self.arranged_cards = [];
      self.one_sixth_cards_array = [];
      self.one_third_half_array = [];
    this.wordpressApiService.getCards()
        .subscribe(res => {
          console.log(res);
          this.cards = res;
          let one_sixth_array_no = 0;
          let o_third_half_array_no = 0;
          this.one_sixth_cards_array[one_sixth_array_no] = [];
          this.one_third_half_array[o_third_half_array_no] = [];
          for (let i = 0; i < res.length; i++) {
              console.log(res[i].flex_layout);
              if (res[i].flex_layout == 'one-sixth') {
                  if (this.one_sixth_cards_array[one_sixth_array_no].length === 4) {
                      one_sixth_array_no++;
                      this.one_sixth_cards_array[one_sixth_array_no] = [];
                      this.one_sixth_cards_array[one_sixth_array_no].push(res[i]);
                  }else {
                      this.one_sixth_cards_array[one_sixth_array_no].push(res[i]);
                  }
              }else if (res[i].flex_layout == 'one-third-half') {
                  if (this.one_third_half_array[o_third_half_array_no].length === 2) {
                      o_third_half_array_no++;
                      this.one_third_half_array[o_third_half_array_no] = [];
                      this.one_third_half_array[o_third_half_array_no].push(res[i]);
                  }else {
                      this.one_third_half_array[o_third_half_array_no].push(res[i]);
                  }
              }else {
                  self.arranged_cards.push(res[i]);
              }
          }
            console.log(this.arranged_cards);
            console.log(this.one_sixth_cards_array);
            console.log(this.one_third_half_array);
        });
  }

}
