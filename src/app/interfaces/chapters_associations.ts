export interface HeaderSlide {
    imageUrl: string;
}

export interface Contact {
    name: string;
    title: string;
    email: string;
    phone: string;
    website: string;
    website2: string;
}

export interface Association {
    title: string;
    description: string;
    category: string;
    contact: Contact;
    slug: string;
    header_slides: HeaderSlide[];
}

export interface Chapter {
    title: string;
    description: string;
    year: string;
    website: string;
    section_local: string;
    slug: string;
    header_slides: HeaderSlide[];
}
