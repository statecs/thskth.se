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
}

export interface Restaurant {
    title: string;
    description: string;
    imageUrl: string;
    menu: Menu[];
}
