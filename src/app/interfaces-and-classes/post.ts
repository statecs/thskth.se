export interface Author {
  name: string;
  email: string;
  avatar_url: any;
}
export interface Category {
  name: string;
  slug: string;
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
  categories: Category[];
}

export class Post implements IPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  image: any;
  published_date: string;
  last_modified: string;
  author: Author;
  categories: Category[];

  static convertToPostType(data: any) {
    const posts: Post[] = [];
    data.forEach(p => {
      const image: any = {};
      if (p.featured_image_url) {
        image.thumbnail = p.featured_image_url;
        image.medium = p.featured_image_url;
        image.large = p.featured_image_url;
      }

      const categories: Category[] = [];
      p.pure_taxonomies.categories.forEach(c => {
        categories.push({
          name: c.name,
          slug: c.slug
        });
      });

      posts.push({
        id: p.id,
        title: p.title.rendered,
        slug: p.slug,
        content: p.content.rendered,
        image: image,
        published_date: p.date,
        last_modified: p.modified,
        categories: categories,
        author: this.castDataToAuthorType(p)
      });
    });
    return posts;
  }

  static castDataToAuthorType(data: any): Author {
    const author: Author = {
      name: data["_embedded"].author[0].name,
      email: data.author.user_email,
      avatar_url: {
        thumbnail: data["_embedded"].author[0].avatar_urls["24"],
        medium: data["_embedded"].author[0].avatar_urls["48"],
        large: data["_embedded"].author[0].avatar_urls["96"]
      }
    };
    if (data.length > 0) {
      author.name = data[0].name;
    }
    return author;
  }
}
