import {HrefToSlugPipe} from '../pipes/href-to-slug.pipe';

export interface Category {
    name: string;
    slug: string;
}

export interface ISearchResult {
    title: string;
    link: string;
    slug: string;
    content: string;
    image: string;
    color: string;
    categories: Category[];
}

export class SearchResult implements ISearchResult {
    static hrefToSlugPipeFilter = new HrefToSlugPipe();
    title: string;
    link: string;
    slug: string;
    content: string;
    image: string;
    color: string;
    categories: Category[];

    static convertPostsToSearchResultType(res) {
        const results: SearchResult[] = [];
        if (res) {
            res.forEach((p) => {
                const categories: Category[] = [];
                p.pure_taxonomies.categories.forEach((c) => {
                    categories.push({
                        name: c.name,
                        slug: c.slug
                    });
                });
                results.push({
                    title: p.title.rendered,
                    link: p.link,
                    slug: p.slug,
                    content: p.content.rendered,
                    image: '',
                    color: '',
                    categories: categories,
                });
            });
        }
        return results;
    }

    static convertPagesToSearchResultType(res) {
        const results: SearchResult[] = [];
        if (res) {
            res.forEach((p) => {
                let image: string = null;
                if (p.acf.header_image) {
                    image = p.acf.header_image.sizes.thumbnail;
                }
                results.push({
                    title: p.title.rendered,
                    link: this.getSlug(p.link),
                    slug: p.slug,
                    content: p.content.rendered,
                    image: image,
                    color: p.acf.header_color,
                    categories: [],
                });
            });
        }
        return results;
    }

    static getSlug(link: string) {
        let slug = '';
        if (link.substring(link.length - 8) === '?lang=sv') {
            link = link.substring(0, link.length - 8);
            slug = this.hrefToSlugPipeFilter.transform(link);
        }else {
            slug = this.hrefToSlugPipeFilter.transform(link);
        }
        return slug;
    }

    static convertFAQsToSearchResultType(res) {
        const results: SearchResult[] = [];
        if (res) {
            res.forEach((p) => {
                const categories: Category[] = [];
                p.pure_taxonomies.faq_category.forEach((c) => {
                    categories.push({
                        name: c.name,
                        slug: c.slug
                    });
                });
                results.push({
                    title: p.title.rendered,
                    link: p.link,
                    slug: p.slug,
                    content: p.content.rendered,
                    image: '',
                    color: '',
                    categories: categories,
                });
            });
        }
        return results;
    }
}
