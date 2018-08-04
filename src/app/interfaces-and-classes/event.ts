import {colors} from '../utils/colors';

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

    static convertToEventType(data: any[], calendarId: string, event_image_base_url: string): Event[] {
        const result: Array<Event> = [];
        data.forEach((event) => {
            let imageUrl: string;
            if (event.attachments) {
                imageUrl = event_image_base_url + event.attachments[0].fileId;
            }else {
                imageUrl = '';
            }
            let start: Date;
            if (event.start.dateTime) {
                start = new Date(event.start.dateTime);
            }else if (event.start.date) {
                start = new Date(Date.parse(event.start.date));
            }
            let end: Date;
            if (event.end.dateTime) {
                end = new Date(event.end.dateTime);
            }else if (event.end.date) {
                end = new Date(Date.parse(event.end.date));
            }
            result.push({
                id: event.id,
                title: event.summary,
                start: start,
                end: end,
                description: event.description,
                imageUrl: imageUrl,
                color: colors.yellow,
                location: event.location,
                creator: event.creator,
                meta: {
                    event
                },
                calendarId: calendarId
            });
        });
        return result;
    }
}
