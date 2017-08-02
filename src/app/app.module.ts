import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Routes import
import { routing } from './app.routes';

// Services
import { WordpressApiService } from './services/wordpress/wordpress-api.service';
import { APP_CONFIG, appConfig } from './app.config';
import { CookieModule } from 'ngx-cookie';
import { CardCategorizerCardContainerService } from './services/component-communicators/card-categorizer-card-container.service';
import { PopupWindowCommunicationService } from './services/component-communicators/popup-window-communication.service';
import { GoogleCalendarService } from './services/google-calendar/google-calendar.service';
import { CalendarCommunicationService } from './services/component-communicators/calendar-communication.service';
import { SocialMediaPostService } from './services/social-media-post/social-media-post.service';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AboutThsComponent } from './components/about-ths/about-ths.component';
import { NavbarPrimaryComponent } from './components/header/navbar-primary/navbar-primary.component';
import { NavbarSecondaryComponent } from './components/header/navbar-secondary/navbar-secondary.component';
import { NavbarSectionsComponent } from './components/footer/navbar-sections/navbar-sections.component';
import { NavbarFooterComponent } from './components/footer/navbar-footer/navbar-footer.component';
import { CardCategorizerComponent } from './components/card-categorizer/card-categorizer.component';
import { CardsContainerComponent } from './components/cards-container/cards-container.component';
import { TextSliderComponent } from './components/text-slider/text-slider.component';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { CardsSocialContainerComponent } from './components/cards-social-container/cards-social-container.component';
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { CardTextPipe } from './pipes/card-text.pipe';
import { PopupWindowComponent } from './components/popup-window/popup-window.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EventsCalendarComponent } from './components/events-calendar/events-calendar.component';
import { CalendarHeaderComponent } from './components/calendar/calendar-header/calendar-header.component';
import { CalendarDatePipe } from './pipes/calendar-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    AboutThsComponent,
    NavbarPrimaryComponent,
    NavbarSecondaryComponent,
    NavbarSectionsComponent,
    NavbarFooterComponent,
    CardCategorizerComponent,
    CardsContainerComponent,
    TextSliderComponent,
    ImageSliderComponent,
    CardsSocialContainerComponent,
    GoogleMapsComponent,
    ContactInfoComponent,
    CardTextPipe,
    PopupWindowComponent,
    CalendarComponent,
    EventsCalendarComponent,
    CalendarHeaderComponent,
    CalendarDatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    CookieModule.forRoot(),
    BrowserAnimationsModule,
    CalendarModule.forRoot()
  ],
  providers: [
      WordpressApiService,
      CardCategorizerCardContainerService,
      PopupWindowCommunicationService,
      GoogleCalendarService,
      CalendarCommunicationService,
      SocialMediaPostService,
      {provide: APP_CONFIG, useValue: appConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
