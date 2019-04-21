interface CardPrimaryButton {
  text: string;
  link: string;
}

interface CardOrder {
  order_id: string;
  template: string;
}

export interface CardCategory {
  id: number;
  name: string;
  order: number;
}

export interface SubCard {
  title: string;
  background_color: string;
  color: string;
  background_image: any;
  slug: string;
  slug_to_page: string;
  window_type: string;
  card_type: string;
  content: string;
}

export interface Card {
  id: number;
  date: string;
  slug: string;
  slug_to_page: string;
  window_type: string;
  title: string;
  content: string;
  link: string;
  link_text: string;
  link_url: string;
  item_id: string;
  background_color: string;
  color: string;
  background_image: any;
  card_type: string;
  menu_order: number;
  flex_layout: string;
  card_order: CardOrder;
  card_primary_buttons: CardPrimaryButton[];
  one_sixth_sub_cards: SubCard[];
  one_third_half_sub_cards: SubCard[];
}

export class Card implements Card {
  // Cast response data to Card type
  static convertToCardType(res) {
    const result: Array<Card> = [];
    if (res) {
      res.forEach(c => {
        const cardOrder = {
          order_id: c.menu_order,
          template: c.acf.template
        };

        const cardPrimaryButtons = [];
        let oneSixthSubCards: SubCard[] = [];
        let oneThirdHalfSubCards: SubCard[] = [];

        let link_text = "";
        let link_url = "";
        if (c.acf.card_primary_buttons) {
          link_text = c.acf.card_primary_buttons[0].text;
          link_url = c.acf.card_primary_buttons[0].link;
          /*   c.acf.card_primary_buttons.forEach(b => {
            cardPrimaryButtons.push({
              text: b.text,
              link: b.link
            });
          });*/
        }

        if (c.acf.one_sixth_sub_cards) {
          oneSixthSubCards = this.castDataToSubCardType(
            c.acf.one_sixth_sub_cards
          );
        }
        if (c.acf.one_third_half_sub_card) {
          oneThirdHalfSubCards = this.castDataToSubCardType(
            c.acf.one_third_half_sub_card
          );
        }
        let bg_img = "";
        if (c.acf.background_image) {
          bg_img = c.acf.background_image.sizes;
        }
        const cardData = new Card(
          c.id,
          c.date,
          c.slug,
          c.acf.slug_to_page,
          c.acf.window_type,
          c.title.rendered,
          c.content.rendered,
          c.link,
          c.link_text,
          c.link_url,
          c.acf.item_id,
          c.acf.background_color,
          c.acf.color,
          bg_img,
          c.acf.card_type,
          c.menu_order,
          c.acf.flex_layout,
          cardOrder,
          cardPrimaryButtons,
          oneSixthSubCards,
          oneThirdHalfSubCards
        );
        result.push(cardData);
      });
    }
    return result;
  }

  static castDataToSubCardType(data) {
    const subCards: SubCard[] = [];
    data.forEach(c => {
      let bg_image = "";
      if (c.background_image !== false) {
        bg_image = c.background_image.sizes;
      }
      subCards.push({
        title: c.title,
        background_color: c.background_color,
        color: c.color,
        background_image: bg_image,
        slug: this.getSubCardSlug(c.slug_to_page),
        slug_to_page: c.slug_to_page,
        window_type: c.window_type,
        card_type: c.card_type,
        content: c.content
      });
    });
    return subCards;
  }

  static getSubCardSlug(data): string {
    const array: [string] = data.split("/");
    return array[array.length - 1];
  }

  constructor(
    public id: number,
    public date: string,
    public slug: string,
    public slug_to_page: string,
    public window_type: string,
    public title: string,
    public content: string,
    public link: string,
    public link_text: string,
    public link_url: string,
    public item_id: string,
    public background_color: string,
    public color: string,
    public background_image: any,
    public card_type: string,
    public menu_order: number,
    public flex_layout: string,
    public card_order: CardOrder,
    public card_primary_buttons: CardPrimaryButton[],
    public one_sixth_sub_cards: SubCard[],
    public one_third_half_sub_cards: SubCard[]
  ) {}
}
