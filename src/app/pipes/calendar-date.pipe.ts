import { Pipe, PipeTransform } from "@angular/core";
import * as format from "date-fns/format";

@Pipe({
  name: "calendarDate"
})
export class CalendarDatePipe implements PipeTransform {
  transform(value: any, arg: any): any {
    let date: any;
    if (arg === "month") {
      date = format(value, "MMM YYYY");
    } else if (arg === "week") {
      date = "Week " + format(value, "W of YYYY");
    } else if (arg === "day") {
      date = format(value, "dddd, MMMM D, YYYY");
    }
    return date;
  }
}
