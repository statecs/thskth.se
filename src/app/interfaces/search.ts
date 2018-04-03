export interface Category {
    name: string;
    slug: string;
}

export interface SearchResult {
    title: string;
    link: string;
    slug: string;
    content: string;
    image: string;
    color: string;
    categories: Category[];
}
