import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CardCategorizerComponent } from '../card-categorizer/card-categorizer.component';
import { CardsContainerComponent } from '../cards-container/cards-container.component';
import { TextSliderCommunicationService } from '../../services/component-communicators/text-slider-communication.service';
import { FaqsService } from '../../services/wordpress/faqs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(  private wordpressApiService: WordpressApiService,
                private textSliderCommunicationService: TextSliderCommunicationService,
                private faqsService: FaqsService) {
  }

  ngOnInit() {

      this.faqsService.getFAQs_OfEachCategories(1).subscribe((faqs) => {
          this.textSliderCommunicationService.send_data_to_textSlider(faqs);
      });
  }

}
