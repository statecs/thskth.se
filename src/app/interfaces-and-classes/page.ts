export interface ImageGalleryItem {
    image: string;
    title: string;
    url: string;
    description: string;
}

export interface TextGalleryItem {
    title: string;
    url: string;
    description: string;
}

export interface TextGallery {
    number_of_columns: number;
    items: TextGalleryItem[];
}

export interface ImageGallery {
    number_of_columns: number;
    items: ImageGalleryItem[];
}

export interface RelatedLink {
    name: string;
    url: string;
}

interface Header {
    header_image: string;
    header_color: string;
}

export interface Author {
    name: string;
    email: string;
}

export interface Page {
    id: number;
    name: string;
    slug: string;
    last_modifiled: string;
    content: string;
    header: Header;
    template: string;
    image_gallery: {
        number_of_columns: number,
        items: ImageGalleryItem[]
    };
    text_gallery: {
        number_of_columns: number,
        items: TextGalleryItem[]
    };
    related_links: RelatedLink[];
    author: Author;
}
