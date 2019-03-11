export interface ISlide {
  id: number;
  title: string;
  description: string;
  template: string;
  link_to_page: string;
  video: string;
  menu_order: number;
  bg_image: any;
  bg_color: any;
}

export class Slide implements ISlide {
  id: number;
  title: string;
  description: string;
  template: string;
  link_to_page: string;
  video: string;
  menu_order: number;
  bg_image: any;
  bg_color: any;

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
        video: slide.acf.video,
        menu_order: slide.menu_order,
        bg_image: bg_image,
        bg_color: slide.acf.background_color
      });
    });
    return slides;
  }
}
