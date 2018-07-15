import {BaseDataInterface} from '../services/abstract-services/base-data.service';

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
}