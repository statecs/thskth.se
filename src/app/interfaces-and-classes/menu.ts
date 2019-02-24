export interface IMenuItem {
    id: number;
    object_slug: number;
    title: string;
    url: string;
    type_label: string;
    children: any;
}

export class MenuItem implements IMenuItem {
    id: number;
    object_slug: number;
    title: string;
    url: string;
    type_label: string;
    children: any;

    static convertToplevelToMenuItem2Type(res): MenuItem[] {
        const topLevel_menu: Array<MenuItem> = [];
        if (res) {
            for (const item of res) {
                topLevel_menu.push({
                    id: item.id,
                    object_slug : item.object_slug,
                    title : item.title,
                    url : item.url,
                    type_label : item.object,
                    children: item.children
                });
            }
        }
        return topLevel_menu;
    }

    static convertToMainSubMenu(items, object_slug) {
        const sub_menu: MenuItem[] = [];
        if (items) {
            for (const item of items) {
                if (item.object_slug === object_slug) {
                    item.children.forEach(i_child => {
                        sub_menu.push({
                            id: i_child.id,
                            object_slug : i_child.object_slug,
                            title : i_child.title,
                            url : i_child.url,
                            type_label : i_child.object,
                            children: i_child.children
                        });
                    });
                    return sub_menu;
                }
            }
        }
        return sub_menu;
    }

    static convertToSecondarySubMenu(items, subMenu_slug, secondary_subMenu_slug): MenuItem[] {
        const secondary_sub_menu: MenuItem[] = [];
        if (items) {
            for (const item of items) {
                if (item.object_slug === subMenu_slug) {
                    item.children.forEach(i_child => {
                        if (i_child.object_slug === secondary_subMenu_slug && i_child.children) {
                            i_child.children.forEach(i_grandchild => {
                                secondary_sub_menu.push({
                                    id: i_grandchild.id,
                                    object_slug : i_grandchild.object_slug,
                                    title : i_grandchild.title,
                                    url : i_grandchild.url,
                                    type_label : i_grandchild.object,
                                    children: i_grandchild.children
                                });
                            });
                        }
                    });
                    return secondary_sub_menu;
                }
            }
        }
        return secondary_sub_menu;
    }
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

export interface IMainMenuItem {
    title: string;
    url: string;
    children: MenuItemChild[];
}

export class MainMenuItem implements IMainMenuItem {

    // Cast response data to MenuItem type
    static convertToMenuItemType(res) {
        const menu: Array<MainMenuItem> = [];
        if (res) {
            for (const item of res) {
                const menu_item_children = [];
                if (item.children) {
                    item.children.forEach(i_child => {
                        const menu_item_grandchildren = [];
                        if (i_child.children) {
                            i_child.children.forEach(i_grandchild => {
                                menu_item_grandchildren.push({
                                    title : i_grandchild.title,
                                    url : i_grandchild.url
                                });
                            });
                        }
                        menu_item_children.push({
                            title : i_child.title,
                            url : i_child.url,
                            children : menu_item_grandchildren
                        });
                    });
                }

                const menuItem = new MainMenuItem(
                    item.title,
                    item.url,
                    menu_item_children
                );
                menu.push(menuItem);
            }
        }
        return menu;
    }

    constructor(
        public title: string,
        public url: string,
        public children: MenuItemChild[]
    ) {}
}
