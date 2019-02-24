import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CalendarModule } from 'angular-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReCaptchaModule } from 'angular2-recaptcha';

// Routes import
import { routing } from './app.routes';

// Services
import { WordpressApiService } from './services/wordpress/wordpress-api.service';
import { APP_CONFIG, appConfig } from './app.config';
import { CookieModule } from 'ngx-cookie';
import { CardCategorizerCardContainerService } from './services/component-communicators/card-categorizer-card-container.service';
import { PopupWindowCommunicationService } from './services/component-communicators/popup-window-communication.service';
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
import { SearchMenubarCommunicationService } from './services/component-communicators/search-menubar-communication.service';
import { ArchiveService } from './services/wordpress/archive.service';
import { RestaurantService } from './services/wordpress/restaurant.service';
import { SelectSliderCommunicationService } from './services/component-communicators/select-slider-communication.service';
import { PostsService } from './services/wordpress/posts.service';
import { ImageSliderCommunicationService } from './services/component-communicators/image-slider-communication.service';
import {ContactFormService} from './services/forms/contact-form.service';
import {TitleCommunicationService} from './services/component-communicators/title-communication.service';
import {HideUICommunicationService} from './services/component-communicators/hide-ui-communication.service';

// Pipes
import { CardTextPipe } from './pipes/card-text.pipe';
import { CalendarDatePipe } from './pipes/calendar-date.pipe';
import { MarkMatchedWordsPipe } from './pipes/mark-matched-words.pipe';
import { HrefToSlugPipe } from './pipes/href-to-slug.pipe';
import { RemoveLangParamPipe } from './pipes/remove-lang-param.pipe';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';

// Directives
import { AutoFocusDirective } from './directives/auto-focus.directive';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavbarPrimaryComponent } from './components/header/navbar-primary/navbar-primary.component';
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
import { SupportComponent } from './components/support/support.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { OneColumnTemplateComponent } from './components/single-view-templates/one-column-template/one-column-template.component';
import { TwoColumnsTemplateComponent } from './components/single-view-templates/two-columns-template/two-columns-template.component';
import { ThreeColumnsTemplateComponent } from './components/single-view-templates/three-columns-template/three-columns-template.component';
import { SingleViewComponent } from './components/single-view/single-view.component';
import { TextGalleryComponent } from './components/text-gallery/text-gallery.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { SubPageComponent } from './components/page-section/sub-page/sub-page.component';
import { LiveComponent } from './components/live-section/live/live.component';
import { NewsComponent } from './components/news/news.component';
import { OffersComponent } from './components/offers/offers.component';
import { NotificationBarComponent } from './components/notification-bar/notification-bar.component';
import { PrimarySliderComponent } from './components/primary-slider/primary-slider.component';
import { ImageSliderSecondaryComponent } from './components/image-slider-secondary/image-slider-secondary.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ContactComponent } from './components/contact-section/contact/contact.component';
import { LiveSectionComponent } from './components/live-section/live-section.component';
import { PageSectionComponent } from './components/page-section/page-section.component';
import { SearchMenubarComponent } from './components/search-menubar/search-menubar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { ChaptersAssociationsComponent } from './components/chapters-associations/chapters-associations.component';
import { ContactSubpageComponent } from './components/contact-section/contact-subpage/contact-subpage.component';
import { LoaderMessageComponent } from './components/loader-message/loader-message.component';
import { JoinUsComponent } from './components/advertisements/join-us/join-us.component';
import { EventsCardComponent } from './components/advertisements/events-card/events-card.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SelectSliderComponent } from './components/select-slider/select-slider.component';
import { SearchComponent } from './components/search/search.component';
import { HeaderSliderComponent } from './components/header-slider/header-slider.component';
import { AddLangToSlugPipe } from './pipes/add-lang-to-slug.pipe';
import { FeaturedFaqsComponent } from './components/featured-faqs/featured-faqs.component';
import {NotificationBarCommunicationService} from './services/component-communicators/notification-bar-communication.service';
import { RelatedLinksComponent } from './components/advertisements/related-links/related-links.component';
import { CookieNotificationBarComponent } from './components/cookie-notification-bar/cookie-notification-bar.component';
import {DataFetcherService} from './services/utility/data-fetcher.service';
import {FacebookPostService} from './services/social-media-post/facebook-post.service';
import {InstagramPostService} from './services/social-media-post/instagram-post.service';
import {GoogleCalendarModule} from './services/google-calendar/google-calendar.module';
import {FaqCategoriesService} from './services/wordpress/faq-categories.service';
import {FooterNavigationService} from './services/wordpress/footer-navigation.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LoginComponent } from './components/login/login.component';
import { EventsMobileComponent } from './components/events-calendar/events-mobile/events-mobile.component';
import { EventsCardsComponent } from './components/events-calendar/events-cards/events-cards.component';
import { EventsListComponent } from './components/events-calendar/events-list/events-list.component';
import {SanitizeUrlPipe} from './pipes/sanitizeUrl.pipe';
import {ChaptersService} from './services/wordpress/chapters.service';
import {AssociationsService} from './services/wordpress/associations.service';
import {SanitizeHtmlPipe} from './pipes/sanitizeHtml.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavbarPrimaryComponent,
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
    MarkMatchedWordsPipe,
    ContactSectionComponent,
    ContactFormComponent,
    OneColumnTemplateComponent,
    TwoColumnsTemplateComponent,
    ThreeColumnsTemplateComponent,
    SingleViewComponent,
    TextGalleryComponent,
    ImageGalleryComponent,
      SubPageComponent,
    LiveComponent,
    NewsComponent,
    OffersComponent,
    NotificationBarComponent,
    PrimarySliderComponent,
    ImageSliderSecondaryComponent,
    BreadcrumbComponent,
    SupportComponent,
    HrefToSlugPipe,
    ContactComponent,
    LiveSectionComponent,
      PageSectionComponent,
    SearchMenubarComponent,
    AutoFocusDirective,
    ChatbotComponent,
    RestaurantsComponent,
    ArchiveComponent,
    ChaptersAssociationsComponent,
    ContactSubpageComponent,
    LoaderMessageComponent,
    JoinUsComponent,
    EventsCardComponent,
    LoaderComponent,
    SelectSliderComponent,
    SearchComponent,
    HeaderSliderComponent,
    RemoveLangParamPipe,
    AddLangToSlugPipe,
    FeaturedFaqsComponent,
    RelatedLinksComponent,
    EscapeHtmlPipe,
    CookieNotificationBarComponent,
    UserProfileComponent,
    LoginComponent,
    EventsMobileComponent,
    EventsCardsComponent,
    EventsListComponent,
    SanitizeUrlPipe,
    SanitizeHtmlPipe,
  ],
  imports: [
      BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    ReCaptchaModule,
    CookieModule.forRoot(),
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
      GoogleCalendarModule,
  ],
  providers: [
      WordpressApiService,
      CardCategorizerCardContainerService,
      PopupWindowCommunicationService,
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
      SearchMenubarCommunicationService,
      ArchiveService,
      RestaurantService,
      SelectSliderCommunicationService,
      PostsService,
      ImageSliderCommunicationService,
      ContactFormService,
      NotificationBarCommunicationService,
      TitleCommunicationService,
      HideUICommunicationService,
      DataFetcherService,
      FacebookPostService,
      InstagramPostService,
      FaqCategoriesService,
      FooterNavigationService,
      ChaptersService,
      AssociationsService,
      {provide: APP_CONFIG, useValue: appConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
