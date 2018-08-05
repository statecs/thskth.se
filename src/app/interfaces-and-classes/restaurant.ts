export interface Dish {
    title: string;
    description: string;
    price: string;
    image: string;
}

export interface DishesTime {
    serving_time: string;
    dishes: Dish[];
}

export interface Menu {
    weekday: string;
    lunch: DishesTime;
    a_la_carte: DishesTime;
    full_text: string;
}

export interface IRestaurant {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    menu: Menu[];
}

export class Restaurant implements IRestaurant {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    menu: Menu[];

    static convertToRestaurantType(res): Restaurant[] {
        const results: Restaurant[] = [];
        if (res) {
            res.forEach((p) => {
                let image = '';
                if (p._embedded['wp:featuredmedia']) {
                    image = p._embedded['wp:featuredmedia'][0].source_url;
                }
                results.push({
                    id: p.id,
                    title: p.title.rendered,
                    description: p.content.rendered,
                    imageUrl: image,
                    menu: this.castResTo_MenuType(p.acf.menu),
                });
            });
        }
        return results;
    }

    static castResTo_MenuType(data) {
        const menus: Menu[] = [];
        if (data) {
            data.forEach((m) => {
                let serving_time_l = '';
                let serving_time_a = '';
                if (m.lunch[0]) {
                    serving_time_l = m.lunch[0].serving_time;
                }
                if (m.a_la_carte[0]) {
                    serving_time_a = m.lunch[0].serving_time;
                }
                menus.push({
                    weekday: m.weekday,
                    lunch: {
                        serving_time: serving_time_l,
                        dishes: this.castResTo_DishType(m.lunch[0])
                    },
                    a_la_carte: {
                        serving_time: serving_time_a,
                        dishes: this.castResTo_DishType(m.a_la_carte[0])
                    },
                    full_text: m.full_text
                });
            });
        }
        return menus;
    }

    static castResTo_DishType(data) {
        const dishes: Dish[] = [];
        if (data) {
            data.dish.forEach((d) => {
                let image = '';
                if (d.image) {
                    image = d.image.url;
                }
                dishes.push({
                    title: d.title,
                    description: d.description,
                    price: d.price,
                    image: image
                });
            });
        }
        return dishes;
    }
}