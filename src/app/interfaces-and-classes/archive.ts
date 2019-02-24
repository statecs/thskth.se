export interface SearchParams {
    searchTerm: string;
    categoryID: number;
    start_date: string;
    end_date: string;
}

export interface Document {
    title: string;
    filename: string;
    url: string;
    icon: string;
    mime_type: string;
}

export interface ArchiveCategory {
    id: number;
    name: string;
    slug: number;
}

export interface Author {
    name: string;
    avatar_url: string;
}

export interface Archive {
    id: number;
    slug: string;
    title: string;
    published: string;
    lastModified: string;
    description: string;
    documents: Document[];
    categories: ArchiveCategory[];
    author: Author;
}
