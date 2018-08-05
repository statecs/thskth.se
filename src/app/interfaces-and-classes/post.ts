export interface Author {
    name: string;
    email: string;
    avatar_url: any;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: any;
    published_date: string;
    last_modified: string;
    author: Author;
}
