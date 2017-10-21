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
import { SupportComponent } from './components/support/support.component';
import { LiveSectionComponent } from './components/live-section/live-section.component';
import { LiveComponent } from './components/live-section/live/live.component';
import { OffersComponent } from './components/offers/offers.component';
import { NewsComponent } from './components/news/news.component';
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { ChaptersAssociationsComponent } from './components/chapters-associations/chapters-associations.component';
import {StudentLifeSectionComponent} from './components/student-life-section/student-life-section.component';
import { ContactSubpageComponent } from './components/contact-section/contact-subpage/contact-subpage.component';
import {SearchComponent} from './components/search/search.component';

const appRoutes: Routes = [
    {
        path: 'associations-and-chapters',
        component: ChaptersAssociationsComponent,
        data: { title: 'Chapters and Associations' }
    },
    {
        path: 'associations-and-chapters/:slug',
        component: ChaptersAssociationsComponent,
        data: { title: 'Chapters and Associations' }
    },
    {
        path: 'archive',
        component: ArchiveComponent,
        data: { title: 'Archive' }
    },
    {
        path: 'search',
        component: SearchComponent,
        data: { title: 'Search' }
    },
    {
        path: 'support',
        component: SupportComponent,
        data: { title: 'Support' }
    },
    {
        path: 'support/:category',
        component: SupportComponent,
        data: { title: 'Support' }
    },
    {
        path: 'restaurant',
        component: RestaurantComponent,
        data: { title: 'Restaurant' }
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
        path: ':lang/about-ths',
        component: AboutThsSectionComponent,
        data: { title: 'About THS section' },
        children: [
            {path: '', component: AboutComponent, data: { title: 'About THS' }},
            {path: ':slug', component: AboutComponent, data: { title: 'About THS' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'About THS' }},
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
        path: ':lang/student-life',
        component: StudentLifeSectionComponent,
        data: { title: 'Student life' },
        children: [
            {path: '', component: StudentLifeComponent, data: { title: 'Student life' }},
            {path: ':slug', component: StudentLifeComponent, data: { title: 'Student life' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Student life' }},
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
        path: 'contact',
        component: ContactSectionComponent,
        data: { title: 'Contact' },
        children: [
            {path: '', component: ContactComponent, data: { title: 'Contact' }},
            {path: ':slug', component: ContactSubpageComponent, data: { title: 'Contact Sub Page' }},
            {path: ':slug/:single_page_slug', component: SingleViewComponent, data: { title: 'Contact' }},
        ]
    },
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: ':lang/international',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'internationell' },
        pathMatch: 'full'
    },
    {
        path: 'international',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'international' },
        pathMatch: 'full'
    },
    {
        path: ':lang/professor',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'professor' },
        pathMatch: 'full'
    },
    {
        path: 'professor',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'professor' },
        pathMatch: 'full'
    },
    {
        path: ':lang/student',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'student' },
        pathMatch: 'full'
    },
    {
        path: 'student',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'student' },
        pathMatch: 'full'
    },
    {
        path: ':lang/company',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'företag' },
        pathMatch: 'full'
    },
    {
        path: 'company',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'company' },
        pathMatch: 'full'
    },
    {
        path: ':lang/other',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'övrig' },
        pathMatch: 'full'
    },
    {
        path: 'other',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'other' },
        pathMatch: 'full'
    },
    {
        path: ':lang',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'student' },
        pathMatch: 'full'
    },
    {
        path: '',
        component: HomeComponent,
        data: { title: 'Home page', profession: 'student' },
        pathMatch: 'full'
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        data: { title: 'Page not found' }
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
