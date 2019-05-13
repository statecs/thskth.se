import { NgModule } from "@angular/core";
import { GoogleCalendarService } from "./google-calendar.service";
import { GeneralCalendarService } from "./general.calendar.service";
import { EducationCalendarService } from "./education.calendar.service";
import { EventsCalendarService } from "./events.calendar.service";
import { FutureCalendarService } from "./future.calendar.service";
import { InternationalCalendarService } from "./international.calendar.service";
import { EventsTHSService } from "./eventsTHS.calendar.service";

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    GoogleCalendarService,
    GeneralCalendarService,
    EducationCalendarService,
    EventsCalendarService,
    FutureCalendarService,
    InternationalCalendarService,
    EventsTHSService
  ],
  bootstrap: []
})
export class GoogleCalendarModule {}
