interface CardPrimaryButton {
    text: string;
    link: string;
}

interface CardOrder {
    order_id: string;
    template: string;
}

export interface Card {
    id: number;
    date: string;
    slug: string;
    slug_to_page: string;
    window_type: string;
    title: string;
    content: string;
    excerpt: string;
    link: string;
    item_id: string;
    background_color: string;
    background_image: string | boolean;
    card_type: string;
    card_number: number;
    flex_layout: string;
    card_order: CardOrder;
    card_primary_buttons: CardPrimaryButton[] | boolean;
}

export class Card implements Card {
    constructor(
        public id: number,
        public date: string,
        public slug: string,
        public slug_to_page: string,
        public window_type: string,
        public title: string,
        public content: string,
        public excerpt: string,
        public link: string,
        public item_id: string,
        public background_color: string,
        public background_image: string | boolean,
        public card_type: string,
        public card_number: number,
        public flex_layout: string,
        public card_order: CardOrder,
        public card_primary_buttons: CardPrimaryButton[] | boolean
    ) {}
}
