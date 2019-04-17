export interface HeaderSlide {
  imageUrl: string;
}
interface IAssociation {
  id: number;
  title: string;
  description: string;
  category: string;
  contact: string;
  slug: string;
  header_slides: HeaderSlide[];
}

export class Association implements IAssociation {
  id: number;
  title: string;
  description: string;
  category: string;
  contact: string;
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
          contact: c.acf.contact,
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
  contact: string;
  slug: string;
  header_slides: HeaderSlide[];
}

export class Chapter implements IChapter {
  id: number;
  title: string;
  description: string;
  contact: string;
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
        contact: c.acf.contact,
        slug: c.slug,
        header_slides: this.getHeaderSlides(c.acf.slides)
      });
    });
    return chapters;
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

interface IOther {
  id: number;
  title: string;
  description: string;
  contact: string;
  slug: string;
  header_slides: HeaderSlide[];
}

export class Other implements IOther {
  id: number;
  title: string;
  description: string;
  contact: string;
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
        contact: c.acf.contact,
        slug: c.slug,
        header_slides: this.getHeaderSlides(c.acf.slides)
      });
    });
    return others;
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
