export interface FAQCategory {
    id: number;
    name: string;
    slug: string;
    parent: number;
}

export interface FAQSubMenu {
    id: number;
    name: string;
    slug: string;
    parent: number;
    faqs: FAQ[];
}

export interface FAQ {
    question: string;
    answer: string;
    slug: string;
    category_name: string;
    category_slug: string;
    faq_category: number[];
}
