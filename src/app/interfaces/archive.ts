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

export interface Archive {
    slug: string;
    title: string;
    lastModified: string;
    description: string;
    documents: Document[];
    categories: ArchiveCategory[];
}
