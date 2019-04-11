export interface HeaderSlide {
  imageUrl: string;
}

export interface Contact {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  website2: string;
}

interface IAssociation {
  id: number;
  title: string;
  description: string;
  category: string;
  contact: Contact;
  slug: string;
  header_slides: HeaderSlide[];
}

export class Association implements IAssociation {
  id: number;
  title: string;
  description: string;
  category: string;
  contact: Contact;
  slug: string;
  header_slides: HeaderSlide[];

  static convertToAssociationType(data: any): Association[] {
    const associations: Association[] = [];
    if (data) {
      data.forEach(c => {
        let category: string;
        if (c.pure_taxonomies.ths_associations) {
          category = c.pure_taxonomies.ths_associations[0].name;
        } else {
          category = "other";
        }
        associations.push({
          id: c.id,
          title: c.title.rendered,
          description: c.content.rendered,
          category: category,
          contact: {
            name: c.acf.name,
            title: c.acf.title,
            email: c.acf.email,
            phone: c.acf.phone,
            website: c.acf.website,
            website2: c.acf.website_2
          },
          slug: c.slug,
          header_slides: this.getHeaderSlides(c.acf.slides)
        });
      });
    }
    return associations;
  }

  static getHeaderSlides(data: any) {
    const slides: HeaderSlide[] = [];
    if (data) {
      data.forEach(s => {
        slides.push({
          imageUrl: s.image.url
        });
      });
    }
    return slides;
  }
}

interface IChapter {
  id: number;
  title: string;
  description: string;
  year: string;
  website: string;
  section_local: string;
  slug: string;
  header_slides: HeaderSlide[];
}

export class Chapter implements IChapter {
  id: number;
  title: string;
  description: string;
  year: string;
  website: string;
  section_local: string;
  slug: string;
  header_slides: HeaderSlide[];

  static convertToChapterType(data: any) {
    const chapters: Chapter[] = [];
    data.forEach(c => {
      let image = "";
      if (c._embedded) {
        image = c._embedded["wp:featuredmedia"][0].source_url;
      }
      chapters.push({
        id: c.id,
        title: c.title.rendered,
        description: c.content.rendered,
        year: c.acf.year,
        website: c.acf.website_url,
        section_local: c.acf.section_local,
        slug: c.slug,
        header_slides: [
          {
            imageUrl: image
          }
        ]
      });
    });
    return chapters;
  }
}

interface IOther {
  id: number;
  title: string;
  description: string;
  year: string;
  website: string;
  section_local: string;
  slug: string;
  header_slides: HeaderSlide[];
}

export class Other implements IOther {
  id: number;
  title: string;
  description: string;
  year: string;
  website: string;
  section_local: string;
  slug: string;
  header_slides: HeaderSlide[];

  static convertToOtherType(data: any) {
    const others: Other[] = [];
    data.forEach(c => {
      let image = "";
      if (c._embedded) {
        image = c._embedded["wp:featuredmedia"][0].source_url;
      }
      others.push({
        id: c.id,
        title: c.title.rendered,
        description: c.content.rendered,
        year: c.acf.year,
        website: c.acf.website_url,
        section_local: c.acf.section_local,
        slug: c.slug,
        header_slides: [
          {
            imageUrl: image
          }
        ]
      });
    });
    return others;
  }
}
