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
    image: string;
    category: string;
    contact: Contact;
}

export interface Chapter {
    title: string;
    description: string;
    year: string;
    website: string;
    section_local: string;
    image: string;
}
