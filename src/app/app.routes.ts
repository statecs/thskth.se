import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/home/home.component";
import { EventsCalendarComponent } from "./components/events-calendar/events-calendar.component";
import { ContactSectionComponent } from "./components/contact-section/contact-section.component";
import { ContactComponent } from "./components/contact-section/contact/contact.component";
import { SingleViewComponent } from "./components/single-view/single-view.component";
import { SubPageComponent } from "./components/page-section/sub-page/sub-page.component";
import { SupportComponent } from "./components/support/support.component";
import { LiveSectionComponent } from "./components/live-section/live-section.component";
import { LiveComponent } from "./components/live-section/live/live.component";
import { OffersComponent } from "./components/offers/offers.component";
import { NewsComponent } from "./components/news/news.component";
import { RestaurantsComponent } from "./components/restaurants/restaurants.component";
import { ArchiveComponent } from "./components/archive/archive.component";
import { ChaptersAssociationsComponent } from "./components/chapters-associations/chapters-associations.component";
import { PageSectionComponent } from "./components/page-section/page-section.component";
import { ContactSubpageComponent } from "./components/contact-section/contact-subpage/contact-subpage.component";
import { SearchComponent } from "./components/search/search.component";
import { UserProfileComponent } from "./components/user-profile/user-profile.component";
import { LoginComponent } from "./components/login/login.component";

const appRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Login" }
  },
  {
    path: "user/:username",
    component: UserProfileComponent,
    data: { title: "User profile" }
  },
  {
    path: "associations-and-chapters",
    component: ChaptersAssociationsComponent,
    data: { title: "Chapters and Associations" }
  },
  {
    path: "associations-and-chapters/:slug",
    component: ChaptersAssociationsComponent,
    data: { title: "Chapters and Associations" }
  },
  {
    path: "documents",
    component: ArchiveComponent,
    data: { title: "Documnets" }
  },
  {
    path: "search",
    component: SearchComponent,
    data: { title: "Search" }
  },
  {
    path: "help",
    component: SupportComponent,
    data: { title: "Help" }
  },
  {
    path: "help/faqs/:slug",
    component: SupportComponent,
    data: { title: "Help" }
  },
  {
    path: "help/:category",
    component: SupportComponent,
    data: { title: "Help" }
  },
  {
    path: "restaurants",
    component: RestaurantsComponent,
    data: { title: "Restaurants" }
  },
  {
    path: "offers",
    component: OffersComponent,
    data: { title: "Offers" }
  },
  {
    path: "news",
    component: NewsComponent,
    data: { title: "News" }
  },
  {
    path: "news/:slug",
    component: NewsComponent,
    data: { title: "News" }
  },
  {
    path: "events",
    component: EventsCalendarComponent,
    data: { title: "Events" }
  },
  {
    path: "live",
    component: LiveSectionComponent,
    data: { title: "Live section" },
    children: [{ path: "", component: LiveComponent, data: { title: "Live" } }]
  },
  {
    path: "contact",
    component: ContactSectionComponent,
    data: { title: "Contact" },
    children: [
      { path: "", component: ContactComponent, data: { title: "Contact" } },
      {
        path: ":slug",
        component: ContactSubpageComponent,
        data: { title: "Contact Sub Page" }
      },
      {
        path: ":slug/:single_page_slug",
        component: SingleViewComponent,
        data: { title: "Contact" }
      }
    ]
  },
  {
    path: ":lang/associations-and-chapters",
    component: ChaptersAssociationsComponent,
    data: { title: "Chapters and Associations" }
  },
  {
    path: ":lang/associations-and-chapters/:slug",
    component: ChaptersAssociationsComponent,
    data: { title: "Chapters and Associations" }
  },
  {
    path: ":lang/documents",
    component: ArchiveComponent,
    data: { title: "Documents" }
  },
  {
    path: ":lang/documents/:slug",
    component: ArchiveComponent,
    data: { title: "Documents" }
  },
  {
    path: ":lang/search",
    component: SearchComponent,
    data: { title: "Search" }
  },
  {
    path: ":lang/help",
    component: SupportComponent,
    data: { title: "Help" }
  },
  {
    path: ":lang/help/faqs/:slug",
    component: SupportComponent,
    data: { title: "Help" }
  },
  {
    path: ":lang/help/:category",
    component: SupportComponent,
    data: { title: "Help" }
  },
  {
    path: ":lang/restaurants",
    component: RestaurantsComponent,
    data: { title: "Restaurants" }
  },
  {
    path: ":lang/offers",
    component: OffersComponent,
    data: { title: "Offers" }
  },
  {
    path: ":lang/news",
    component: NewsComponent,
    data: { title: "News" }
  },
  {
    path: ":lang/news/:slug",
    component: NewsComponent,
    data: { title: "News" }
  },
  {
    path: ":lang/events",
    component: EventsCalendarComponent,
    data: { title: "Events" }
  },
  {
    path: ":lang/live",
    component: LiveSectionComponent,
    data: { title: "Live section" },
    children: [{ path: "", component: LiveComponent, data: { title: "Live" } }]
  },
  {
    path: ":lang/contact",
    component: ContactSectionComponent,
    data: { title: "Contact" },
    children: [
      { path: "", component: ContactComponent, data: { title: "Contact" } },
      {
        path: ":slug",
        component: ContactSubpageComponent,
        data: { title: "Contact Sub Page" }
      },
      {
        path: ":slug/:single_page_slug",
        component: SingleViewComponent,
        data: { title: "Contact" }
      }
    ]
  },

  {
    path: "home",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "en",
    component: HomeComponent,
    data: { title: "Home page", lang: "en" },
    pathMatch: "full"
  },
  {
    path: "sv",
    component: HomeComponent,
    data: { title: "Home page", lang: "sv" },
    pathMatch: "full"
  },
  {
    path: ":lang",
    component: PageSectionComponent,
    data: { title: "Student life" },
    children: [
      {
        path: "",
        component: SubPageComponent,
        data: { title: "Student life" }
      },
      {
        path: ":subpage",
        component: SubPageComponent,
        data: { title: "Student life" }
      },
      {
        path: ":subpage/:slug",
        component: SubPageComponent,
        data: { title: "Student life" }
      },
      {
        path: ":subpage/:slug/:single_page_slug",
        component: SingleViewComponent,
        data: { title: "Student life" }
      }
    ]
  },
  /*{
     path: ':lang/:subpage',
     component: PageSectionComponent,
     data: { title: 'Student life' },
     children: [
     {path: '', component: SubPageComponent, data: { title: 'Student life' }},
     {path: ':slug', component: SubPageComponent, data: { title: 'Student life' }},
     {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Student life' }},
     ]
     },*/
  {
    path: "",
    component: HomeComponent,
    data: { title: "Home page", lang: "en" },
    pathMatch: "full"
  },
  {
    path: "**",
    component: PageNotFoundComponent,
    data: { title: "Page not found" }
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
