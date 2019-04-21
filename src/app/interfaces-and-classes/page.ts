import {
  ImageGallery,
  ImageGalleryItem,
  TextGallery,
  TextGalleryItem
} from "./gallery";

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

export interface IPage {
  id: number;
  name: string;
  slug: string;
  last_modifiled: string;
  content: string;
  header: Header;
  template: string;
  image_gallery: {
    number_of_columns: number;
    items: ImageGalleryItem[];
  };
  related_links: RelatedLink[];
  author: Author;
}

export class Page implements IPage {
  id: number;
  name: string;
  slug: string;
  last_modifiled: string;
  content: string;
  header: Header;
  template: string;
  image_gallery: {
    number_of_columns: number;
    items: ImageGalleryItem[];
  };
  related_links: RelatedLink[];
  author: Author;

  static convertToPageType(res) {
    let page: Page;
    let header_image = "";
    let image_gallery: ImageGallery;
    let related_links: RelatedLink[];
    let author: Author = {
      name: "",
      email: ""
    };
    if (res) {
      if (res.featured_image_url) {
        header_image = res.featured_image_url;
      }
      if (res.acf.ths_image_gallery) {
        image_gallery = this.castResToImageGalleryType(res);
      }
      if (res.acf.related_links) {
        related_links = this.getRelatedLinks(res);
      }
      if (res.author) {
        author = {
          name: res.author.display_name,
          email: res.author.user_email
        };
      }
      page = {
        id: res.id,
        name: res.title.rendered,
        slug: res.slug,
        last_modifiled: res.modified,
        content: res.content.rendered,
        header: {
          header_image: header_image,
          header_color: res.acf.header_color
        },
        template: res.acf.template,
        image_gallery: image_gallery,
        related_links: related_links,
        author: author
      };
    }
    return page;
  }

  static getRelatedLinks(res) {
    const items: RelatedLink[] = [];
    res.acf.related_links.forEach(item => {
      items.push({
        name: item.name,
        url: item.url
      });
    });
    return items;
  }

  static castResToImageGalleryType(res) {
    const items: ImageGalleryItem[] = [];
    res.acf.ths_image_gallery[0].gallery_items.forEach(item => {
      items.push({
        image: item.image.url,
        title: item.title,
        url: item.url,
        description: item.description
      });
    });
    return {
      number_of_columns: res.acf.ths_image_gallery[0].number_of_columns,
      items: items
    };
  }
}
