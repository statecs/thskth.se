interface Creator {
    email: string;
    displayName: string;
}

export interface Event {
    title: string;
    start: Date;
    end: Date;
    description: string;
    imageUrl: string;
    color: any;
    location: string;
    creator: Creator;
    meta: any;
}
