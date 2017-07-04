export interface Card {
    id: number;
    date: string;
    slug: string;
    title: string;
    content: string;
    excerpt: string;
    link: string;
}

export class Card implements Card {
    constructor(
        public id: number,
        public date: string,
        public slug: string,
        public title: string,
        public content: string,
        public card_number: string,
        public excerpt: string,
        public link: string,
    ) {}
}
