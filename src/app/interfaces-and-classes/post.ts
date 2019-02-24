export interface Author {
    name: string;
    email: string;
    avatar_url: any;
}

export interface IPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: any;
    published_date: string;
    last_modified: string;
    author: Author;
}

export class Post implements IPost{
    id: number;
    title: string;
    slug: string;
    content: string;
    image: any;
    published_date: string;
    last_modified: string;
    author: Author;

    static convertToPostType(data: any) {
        const posts: Post[] = [];
        data.forEach(p => {
            const image: any = {};
            if (p['_embedded']['wp:featuredmedia']) {
                if (p['_embedded']['wp:featuredmedia'][0]) {
                    if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes) {
                        if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes.thumbnail) {
                            image.thumbnail = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.thumbnail.source_url;
                        }
                        if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium) {
                            image.medium = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.medium.source_url;
                        }
                        if (p['_embedded']['wp:featuredmedia'][0].media_details.sizes.large) {
                            image.large = p['_embedded']['wp:featuredmedia'][0].media_details.sizes.large.source_url;
                        }
                    }
                }
            }
            posts.push({
                id: p.id,
                title: p.title.rendered,
                slug: p.slug,
                content: p.content.rendered,
                image: image,
                published_date: p.date,
                last_modified: p.modified,
                author: this.castDataToAuthorType(p),
            });
        });
        return posts;
    }

    static castDataToAuthorType(data: any): Author {
        const author: Author = {
            name: data['_embedded'].author[0].name,
            email: data.author.user_email,
            avatar_url: {
                thumbnail: data['_embedded'].author[0].avatar_urls['24'],
                medium: data['_embedded'].author[0].avatar_urls['48'],
                large: data['_embedded'].author[0].avatar_urls['96'],
            }
        };
        if (data.length > 0) {
            author.name = data[0].name;
        }
        return author;
    }
}