import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { EventsCalendarComponent } from './components/events-calendar/events-calendar.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { ContactComponent } from './components/contact-section/contact/contact.component';
import { SingleViewComponent } from './components/single-view/single-view.component';
import { SubPageComponent } from './components/page-section/sub-page/sub-page.component';
import { SupportComponent } from './components/support/support.component';
import { LiveSectionComponent } from './components/live-section/live-section.component';
import { LiveComponent } from './components/live-section/live/live.component';
import { OffersComponent } from './components/offers/offers.component';
import { NewsComponent } from './components/news/news.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { ChaptersAssociationsComponent } from './components/chapters-associations/chapters-associations.component';
import { PageSectionComponent } from './components/page-section/page-section.component';
import { ContactSubpageComponent } from './components/contact-section/contact-subpage/contact-subpage.component';
import {SearchComponent} from './components/search/search.component';

const appRoutes: Routes = [
    {
        path: ':lang/associations-and-chapters',
        component: ChaptersAssociationsComponent,
        data: { title: 'Chapters and Associations' }
    },
    {
        path: ':lang/associations-and-chapters/:slug',
        component: ChaptersAssociationsComponent,
        data: { title: 'Chapters and Associations' }
    },
    {
        path: ':lang/archive',
        component: ArchiveComponent,
        data: { title: 'Archive' }
    },
    {
        path: ':lang/search',
        component: SearchComponent,
        data: { title: 'Search' }
    },
    {
        path: ':lang/support',
        component: SupportComponent,
        data: { title: 'Support' }
    },
    {
        path: ':lang/support/faqs/:slug',
        component: SupportComponent,
        data: { title: 'Support' }
    },
    {
        path: ':lang/support/:category',
        component: SupportComponent,
        data: { title: 'Support' }
    },
    {
        path: ':lang/restaurants',
        component: RestaurantsComponent,
        data: { title: 'Restaurants' }
    },
    {
        path: ':lang/offers',
        component: OffersComponent,
        data: { title: 'Offers' }
    },
    {
        path: ':lang/news',
        component: NewsComponent,
        data: { title: 'News' }
    },
    {
        path: ':lang/news/:slug',
        component: NewsComponent,
        data: { title: 'News' }
    },
    {
        path: ':lang/events',
        component: EventsCalendarComponent,
        data: { title: 'Events' }
    },
    {
        path: ':lang/live',
        component: LiveSectionComponent,
        data: { title: 'Live section' },
        children: [
            {path: '', component: LiveComponent, data: { title: 'Live' }}
        ]
    },
    /*{
        path: ':lang/about-ths',
        component: AboutThsSectionComponent,
        data: { title: 'About THS section' },
        children: [
            {path: '', component: AboutComponent, data: { title: 'About THS' }},
            {path: ':slug', component: AboutComponent, data: { title: 'About THS' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'About THS' }},
        ]
    },*/
    {
        path: ':lang/contact',
        component: ContactSectionComponent,
        data: { title: 'Contact' },
        children: [
            {path: '', component: ContactComponent, data: { title: 'Contact' }},
            {path: ':slug', component: ContactSubpageComponent, data: { title: 'Contact Sub Page' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Contact' }},
            ]
    },
    {
        path: ':lang/:subpage',
        component: PageSectionComponent,
        data: { title: 'Student life' },
        children: [
            {path: '', component: SubPageComponent, data: { title: 'Student life' }},
            {path: ':slug', component: SubPageComponent, data: { title: 'Student life' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Student life' }},
        ]
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: ':lang',
        component: HomeComponent,
        data: { title: 'Home page', profession: {en: 'student', sv: 'student'} },
        pathMatch: 'full'
    },
    {
        path: '',
        component: HomeComponent,
        data: { title: 'Home page', profession: {en: 'student', sv: 'student'} },
        pathMatch: 'full'
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        data: { title: 'Page not found' }
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
