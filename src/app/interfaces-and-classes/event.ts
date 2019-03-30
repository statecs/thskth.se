import { colors } from "../utils/colors";
import * as _ from "lodash";
import * as format from "date-fns/format";

interface Creator {
  email: string;
  displayName: string;
}

interface IEvent {
  title: string;
  start: Date;
  end: Date;
  description: string;
  imageUrl: string;
  color: any;
  location: string;
  creator: Creator;
  meta: any;
  calendarId: string;
  calendarName: string;
}

export class Event implements IEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description: string;
  imageUrl: string;
  color: any;
  location: string;
  creator: Creator;
  meta: any;
  calendarId: string;
  calendarName: string;

  static convertFBToEventType(data: any): Event[] {
    const result = [];
    if (data) {
      _.each(data[121470594571005].data, event => {
        let eventStart: any;
        if (event.start_time) {
          eventStart = format(event.start_time, "ddd MMM DD YYYY HH:mm:ss Z");
        }
        let eventEnd: any;
        if (event.end_time) {
          eventEnd = format(event.start_time, "ddd MMM DD YYYY HH:MM:ss Z");
        }

        let locationPlace: string;
        if (event.place.location) {
          locationPlace = event.place.location.street;
        } else {
          locationPlace = "";
        }

        result.push({
          id: event.id,
          title: event.name,
          start: eventStart,
          end: eventEnd,
          description: event.description,
          imageUrl: event.cover.source,
          location: locationPlace,
          color: colors.transparent,
          creator: event.owner.name,
          meta: {
            event
          },
          calendarId: "FB",
          calendarName: "facebook"
        });
      });
    }
    return result;
  }

  static convertToEventType(
    data: any,
    calendarId: string,
    event_image_base_url: string,
    calendarName: string
  ): Event[] {
    const result: Array<Event> = [];
    if (data.items) {
      _.each(data.items, event => {
        let imageUrl: string;
        if (event.attachments) {
          imageUrl = event_image_base_url + event.attachments[0].fileId;
        } else {
          imageUrl = "";
        }
        let start: Date;
        if (event.start && event.start.dateTime) {
          start = new Date(event.start.dateTime);
        } else if (event.start && event.start.date) {
          start = new Date(Date.parse(event.start.date));
        }
        let end: Date;
        if (event.end && event.end.dateTime) {
          end = new Date(event.end.dateTime);
        } else if (event.end && event.end.date) {
          end = new Date(Date.parse(event.end.date));
        }
        if (calendarName == "general") {
          result.push({
            id: event.id,
            title: event.summary,
            start: start,
            end: end,
            color: colors.blue,
            description: event.description,
            imageUrl: imageUrl,
            location: event.location,
            creator: event.creator.email,
            meta: {
              event
            },
            calendarId: calendarId,
            calendarName: calendarName
          });
        } else if (calendarName == "future") {
          result.push({
            id: event.id,
            title: event.summary,
            start: start,
            end: end,
            color: colors.green,
            description: event.description,
            imageUrl: imageUrl,
            location: event.location,
            creator: event.creator.email,
            meta: {
              event
            },
            calendarId: calendarId,
            calendarName: calendarName
          });
        } else if (calendarName == "international") {
          result.push({
            id: event.id,
            title: event.summary,
            start: start,
            end: end,
            color: colors.green,
            description: event.description,
            imageUrl: imageUrl,
            location: event.location,
            creator: event.creator.email,
            meta: {
              event
            },
            calendarId: calendarId,
            calendarName: calendarName
          });
        } else if (calendarName == "education") {
          result.push({
            id: event.id,
            title: event.summary,
            start: start,
            end: end,
            color: colors.purple,
            description: event.description,
            imageUrl: imageUrl,
            location: event.location,
            creator: event.creator.email,
            meta: {
              event
            },
            calendarId: calendarId,
            calendarName: calendarName
          });
        } else if (calendarName == "events") {
          result.push({
            id: event.id,
            title: event.summary,
            start: start,
            end: end,
            color: colors.blue,
            description: event.description,
            imageUrl: imageUrl,
            location: event.location,
            creator: event.creator.email,
            meta: {
              event
            },
            calendarId: calendarId,
            calendarName: calendarName
          });
        }
      });
    }
    return result;
  }
}
