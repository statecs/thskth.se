interface CardPrimaryButton {
    text: string;
    link: string;
}

interface CardOrder {
    order_id: string;
    template: string;
}

export interface CardCategory {
    id: number;
    name: string;
    order: number;
}

export interface SubCard {
    title: string;
    background_color: string;
    background_image: any;
    slug_to_page: string;
    window_type: string;
    card_type: string;
    content: string;
}

export interface Card {
    id: number;
    date: string;
    slug: string;
    slug_to_page: string;
    window_type: string;
    title: string;
    content: string;
    link: string;
    item_id: string;
    background_color: string;
    background_image: any;
    card_type: string;
    card_number: number;
    flex_layout: string;
    card_order: CardOrder;
    card_primary_buttons: CardPrimaryButton[];
    one_sixth_sub_cards: SubCard[];
    one_third_half_sub_cards: SubCard[];
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
        public link: string,
        public item_id: string,
        public background_color: string,
        public background_image: any,
        public card_type: string,
        public card_number: number,
        public flex_layout: string,
        public card_order: CardOrder,
        public card_primary_buttons: CardPrimaryButton[],
        public one_sixth_sub_cards: SubCard[],
        public one_third_half_sub_cards: SubCard[]
    ) {}
}
