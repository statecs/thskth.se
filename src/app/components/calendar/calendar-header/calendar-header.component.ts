import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-calendar-header",
  templateUrl: "./calendar-header.component.html",
  styleUrls: ["./calendar-header.component.scss"]
})
export class CalendarHeaderComponent implements OnInit {
  @Input() view: string;
  @Input() lang: string;
  @Input() viewDate: Date;
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  @Output() updateEvents: EventEmitter<any> = new EventEmitter();
  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  constructor() {}

  triggerEventUpdater() {
    this.updateEvents.emit(null);
  }

  ngOnInit() {}
}
