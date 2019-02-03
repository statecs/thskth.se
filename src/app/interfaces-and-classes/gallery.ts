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
