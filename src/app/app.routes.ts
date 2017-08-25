import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { EventsCalendarComponent } from './components/events-calendar/events-calendar.component';
import { ContactComponent } from './components/contact/contact.component';
import { SingleViewComponent } from './components/single-view/single-view.component';
import { StudentLifeComponent } from './components/student-life/student-life.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { LiveComponent } from './components/live/live.component';
import { OffersComponent } from './components/offers/offers.component';
import { NewsComponent } from './components/news/news.component';
import { SearchComponent } from './components/search/search.component';

const appRoutes: Routes = [
    {
        path: 'search',
        component: SearchComponent,
        data: { title: 'Search' }
    },
    {
        path: 'offers',
        component: OffersComponent,
        data: { title: 'Offers' }
    },
    {
        path: 'news',
        component: NewsComponent,
        data: { title: 'News' }
    },
    {
        path: 'events',
        component: EventsCalendarComponent,
        data: { title: 'Events' }
    },
    {
        path: 'live',
        component: LiveComponent,
        data: { title: 'Live' }
    },
    {
        path: 'live/:slug',
        component: LiveComponent,
        data: { title: 'Live' }
    },
    {
        path: 'live/:slug/:single_page_slug',
        component: SingleViewComponent,
        data: { title: 'Live' }
    },
    {
        path: 'about-ths',
        component: AboutComponent,
        data: { title: 'About THS' }
    },
    {
        path: 'about-ths/:slug',
        component: AboutComponent,
        data: { title: 'About THS' }
    },
    {
        path: 'about-ths/:slug/:single_page_slug',
        component: SingleViewComponent,
        data: { title: 'About THS' }
    },
    {
        path: 'student-life',
        component: StudentLifeComponent,
        data: { title: 'Student life' }
    },
    {
        path: 'student-life/:slug',
        component: StudentLifeComponent,
        data: { title: 'Student life' }
    },
    {
        path: 'student-life/:slug/:single_page_slug',
        component: SingleViewComponent,
        data: { title: 'Student life' }
    },
    {
        path: 'contact',
        component: ContactComponent,
        data: { title: 'Contact' }
    },
    {
        path: 'contact/faq/:category',
        component: FaqsComponent,
        data: { title: 'Contact' }
    },
    {
        path: 'contact/:slug',
        component: ContactComponent,
        data: { title: 'Contact' }
    },
    {
        path: 'contact/:slug/:single_page_slug',
        component: SingleViewComponent,
        data: { title: 'Contact' }
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '',
        component: HomeComponent,
        data: { title: 'Home page' },
        pathMatch: 'full'
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        data: { title: 'Page not found' }
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
