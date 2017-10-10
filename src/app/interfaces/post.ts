export interface Author {
    name: string;
    email: string;
}

export interface Post {
    title: string;
    slug: string;
    content: string;
    image: string;
    published_date: string;
    last_modified: string;
    author: Author;
}