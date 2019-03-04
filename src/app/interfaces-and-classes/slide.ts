export interface ISlide {
  id: number;
  title: string;
  description: string;
  template: string;
  link_to_page: string;
  image: any;
  video: string;
  menu_order: number;
  bg_image: any;
}

export class Slide implements ISlide {
  id: number;
  title: string;
  description: string;
  template: string;
  link_to_page: string;
  image: any;
  video: string;
  menu_order: number;
  bg_image: any;

  static convertToSlideType(res) {
    const slides: Slide[] = [];
    res.forEach(slide => {
      let bg_image = "";
      if (slide.acf.background_image) {
        bg_image = slide.acf.background_image.sizes;
      }
      slides.push({
        id: slide.id,
        title: slide.title.rendered,
        description: slide.content.rendered,
        template: slide.acf.template,
        link_to_page: slide.acf.link_to_page,
        image: slide.acf.image.sizes,
        video: slide.acf.video,
        menu_order: slide.menu_order,
        bg_image: bg_image
      });
    });
    return slides;
  }
}
