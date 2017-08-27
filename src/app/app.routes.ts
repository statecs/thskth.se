import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { AboutThsSectionComponent } from './components/about-ths-section/about-ths-section.component';
import { AboutComponent } from './components/about-ths-section/about/about.component';
import { EventsCalendarComponent } from './components/events-calendar/events-calendar.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { ContactComponent } from './components/contact-section/contact/contact.component';
import { SingleViewComponent } from './components/single-view/single-view.component';
import { StudentLifeComponent } from './components/student-life-section/student-life/student-life.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { LiveSectionComponent } from './components/live-section/live-section.component';
import { LiveComponent } from './components/live-section/live/live.component';
import { OffersComponent } from './components/offers/offers.component';
import { NewsComponent } from './components/news/news.component';
import { SearchComponent } from './components/search/search.component';
import {StudentLifeSectionComponent} from './components/student-life-section/student-life-section.component';

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
        component: LiveSectionComponent,
        data: { title: 'Live section' },
        children: [
            {path: '', component: LiveComponent, data: { title: 'Live' }},
            {path: ':slug', component: LiveComponent, data: { title: 'Live' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Live' }},
        ]
    },
    {
        path: 'about-ths',
        component: AboutThsSectionComponent,
        data: { title: 'About THS section' },
        children: [
            {path: '', component: AboutComponent, data: { title: 'About THS' }},
            {path: ':slug', component: AboutComponent, data: { title: 'About THS' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'About THS' }},
        ]
    },
    {
        path: 'student-life',
        component: StudentLifeSectionComponent,
        data: { title: 'Student life' },
        children: [
            {path: '', component: StudentLifeComponent, data: { title: 'Student life' }},
            {path: ':slug', component: StudentLifeComponent, data: { title: 'Student life' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Student life' }},
        ]
    },
    {
        path: 'contact',
        component: ContactSectionComponent,
        data: { title: 'Contact' },
        children: [
            {path: '', component: ContactComponent, data: { title: 'Contact' }},
            {path: 'faq', component: FaqsComponent, data: { title: 'FAQ' }},
            {path: 'faq/:category', component: FaqsComponent, data: { title: 'FAQ' }},
            {path: ':slug', component: ContactComponent, data: { title: 'Contact' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Contact' }},
            ]
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
