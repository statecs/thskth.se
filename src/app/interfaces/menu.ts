export interface MenuItem2 {
    object_slug: number;
    title: string;
    url: string;
    type_label: string;
}

interface MenuItemGrandchild {
    title: string;
    url: string;
}

interface MenuItemChild {
    title: string;
    url: string;
    children: MenuItemGrandchild[];
}

/*interface MenuItem {
    title: string;
    url: string;
    children: MenuItemChild[];
}*/

export interface MenuItem {
    title: string;
    url: string;
    children: MenuItemChild[];
}

export class MenuItem implements MenuItem {
    constructor(
        public title: string,
        public url: string,
        public children: MenuItemChild[]
    ) {}
}
