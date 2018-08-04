import {NgModule} from '@angular/core';
import {GoogleCalendarService} from './google-calendar.service';
import {AssociationsCalendarService} from './associations.calendar.service';
import {CentralCalendarService} from './central.calendar.service';
import {ChaptersCalendarService} from './chapters.calendar.service';
import {EducationCalendarService} from './education.calendar.service';
import {EventsCalendarService} from './events.calendar.service';
import {FutureCalendarService} from './future.calendar.service';
import {InternationalCalendarService} from './international.calendar.service';
import {ReceptionCalendarService} from './reception.calendar.service';

@NgModule({
    declarations: [

    ],
    imports: [

    ],
    providers: [
        GoogleCalendarService,
        AssociationsCalendarService,
        CentralCalendarService,
        ChaptersCalendarService,
        EducationCalendarService,
        EventsCalendarService,
        FutureCalendarService,
        InternationalCalendarService,
        ReceptionCalendarService,
    ],
    bootstrap: []
})
export class GoogleCalendarModule { }
