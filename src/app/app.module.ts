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
import { FaqsService } from './services/wordpress/faqs.service';
import { TextSliderCommunicationService } from './services/component-communicators/text-slider-communication.service';
import { PagesService } from './services/wordpress/pages.service';
import { MenusService } from './services/wordpress/menus.service';
import { HeaderCommunicationService } from './services/component-communicators/header-communication.service';
import { PrimarySlidesService } from './services/wordpress/primary-slides.service';
import { AppCommunicationService } from './services/component-communicators/app-communication.service';
import { CardsService } from './services/wordpress/cards.service';
import { SearchService } from './services/wordpress/search.service';
import { SearchMenubarCommunicationService } from './services/component-communicators/search-menubar-communication.service';
import { ArchiveService } from './services/wordpress/archive.service';
import { ChaptersAssociationsService } from './services/wordpress/chapters-associations.service';
import { RestaurantService } from './services/wordpress/restaurant.service';

// Pipes
import { CardTextPipe } from './pipes/card-text.pipe';
import { CalendarDatePipe } from './pipes/calendar-date.pipe';
import { MarkMatchedWordsPipe } from './pipes/mark-matched-words.pipe';
import { HrefToSlugPipe } from './pipes/href-to-slug.pipe';

// Directives
import { AutoFocusDirective } from './directives/auto-focus.directive';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
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
import { PopupWindowComponent } from './components/popup-window/popup-window.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { EventsCalendarComponent } from './components/events-calendar/events-calendar.component';
import { CalendarHeaderComponent } from './components/calendar/calendar-header/calendar-header.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { OneColumnTemplateComponent } from './components/single-view-templates/one-column-template/one-column-template.component';
import { TwoColumnsTemplateComponent } from './components/single-view-templates/two-columns-template/two-columns-template.component';
import { ThreeColumnsTemplateComponent } from './components/single-view-templates/three-columns-template/three-columns-template.component';
import { SingleViewComponent } from './components/single-view/single-view.component';
import { TextGalleryComponent } from './components/text-gallery/text-gallery.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { StudentLifeComponent } from './components/student-life-section/student-life/student-life.component';
import { AboutComponent } from './components/about-ths-section/about/about.component';
import { LiveComponent } from './components/live-section/live/live.component';
import { NewsComponent } from './components/news/news.component';
import { OffersComponent } from './components/offers/offers.component';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';
import { PrimarySliderComponent } from './components/primary-slider/primary-slider.component';
import { ImageSliderSecondaryComponent } from './components/image-slider-secondary/image-slider-secondary.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SearchComponent } from './components/search/search.component';
import { ContactComponent } from './components/contact-section/contact/contact.component';
import { LiveSectionComponent } from './components/live-section/live-section.component';
import { AboutThsSectionComponent } from './components/about-ths-section/about-ths-section.component';
import { StudentLifeSectionComponent } from './components/student-life-section/student-life-section.component';
import { SearchMenubarComponent } from './components/search-menubar/search-menubar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { ChaptersAssociationsComponent } from './components/chapters-associations/chapters-associations.component';
import { ContactSubpageComponent } from './components/contact-section/contact-subpage/contact-subpage.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
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
    CalendarDatePipe,
    FaqsComponent,
    MarkMatchedWordsPipe,
    ContactSectionComponent,
    ContactFormComponent,
    OneColumnTemplateComponent,
    TwoColumnsTemplateComponent,
    ThreeColumnsTemplateComponent,
    SingleViewComponent,
    TextGalleryComponent,
    ImageGalleryComponent,
    StudentLifeComponent,
    AboutComponent,
    LiveComponent,
    NewsComponent,
    OffersComponent,
    NotificationBarComponent,
    PrimarySliderComponent,
    ImageSliderSecondaryComponent,
    BreadcrumbComponent,
    SearchComponent,
    HrefToSlugPipe,
    ContactComponent,
    LiveSectionComponent,
    AboutThsSectionComponent,
    StudentLifeSectionComponent,
    SearchMenubarComponent,
    AutoFocusDirective,
    ChatbotComponent,
    RestaurantComponent,
    ArchiveComponent,
    ChaptersAssociationsComponent,
    ContactSubpageComponent
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
      FaqsService,
      TextSliderCommunicationService,
      PagesService,
      MenusService,
      HeaderCommunicationService,
      PrimarySlidesService,
      AppCommunicationService,
      CardsService,
      SearchService,
      SearchMenubarCommunicationService,
      ArchiveService,
      ChaptersAssociationsService,
      RestaurantService,
      {provide: APP_CONFIG, useValue: appConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
