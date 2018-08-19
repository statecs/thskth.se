export interface FAQCategory {
    id: number;
    name: string;
    slug: string;
    parent: number;
}

export interface FAQSubMenu {
    id: number;
    name: string;
    slug: string;
    parent: number;
    faqs: FAQ[];
}

interface IFAQ {
    id: number;
    question: string;
    answer: string;
    slug: string;
    category_name: string;
    category_slug: string;
    faq_category: number[];
}

export class FAQ implements IFAQ {
    id: number;
    question: string;
    answer: string;
    slug: string;
    category_name: string;
    category_slug: string;
    faq_category: number[];

    static convertToFAQType(res, category_name) {
        const faqs: FAQ[] = [];
        if (res) {
            res.forEach((item) => {
                let slug = '';
                if (item.pure_taxonomies.faq_category) {
                    slug = item.pure_taxonomies.faq_category.slug;
                }
                faqs.push({
                    id: item.id,
                    question: item.title.rendered,
                    answer: item.content.rendered,
                    slug: item.slug,
                    category_name: category_name,
                    category_slug: slug,
                    faq_category: item.faq_category,
                });
            });
        }
        return faqs;
    }

    static convertFAQsToChildCategories(res, child_categories, category_name) {
        const subMenus: FAQSubMenu[] = child_categories;
        res.forEach((item) => {
            let slug = '';
            if (item.pure_taxonomies.faq_category) {
                slug = item.pure_taxonomies.faq_category.slug;
            }
            for (let i = 0; i < child_categories.length; i++) {
                if (item.faq_category.indexOf(child_categories[i].id) >= 0) {
                    subMenus[i].faqs.push({
                        id: item.id,
                        question: item.title.rendered,
                        answer: item.content.rendered,
                        slug: item.slug,
                        category_name: category_name,
                        category_slug: slug,
                        faq_category: item.faq_category,
                    });
                }
            }
        });
        return subMenus;
    }

    static convertToFAQSubMenuType(res) {
        const categories: FAQSubMenu[] = [];
        if (res) {
            res.forEach((c) => {
                categories.push({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    parent: c.parent,
                    faqs: [],
                });
            });
        }
        return categories;
    }

    static castDataToFAQCategory(res) {
        const categories: FAQCategory[] = [];
        if (res) {
            res.forEach((c) => {
                categories.push({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    parent: c.parent
                });
            });
        }
        return categories;
    }
}
