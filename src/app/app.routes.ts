import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { AboutThsComponent } from './components/about-ths/about-ths.component';
import { EventsCalendarComponent } from './components/events-calendar/events-calendar.component';
import { FaqsComponent } from './components/faqs/faqs.component';

const appRoutes: Routes = [
    {
        path: 'events-calendar',
        component: EventsCalendarComponent,
        data: { title: 'Events Calendar' }
    },
    {
        path: 'faqs',
        component: FaqsComponent,
        data: { title: 'FAQs' }
    },
    {
        path: 'about-ths',
        component: AboutThsComponent,
        data: { title: 'About THS' }
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
