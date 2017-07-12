import {InjectionToken} from '@angular/core';
import {AppConfig} from './interfaces/appConfig';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export let appConfig: AppConfig = {
    BASE_URL: 'http://kths.se/',
    API_URL: 'http://kths.se/api/wp/v2/',
    CARDS_URL: 'http://kths.se/api/wp/v2/cards',
    POSTS_PAGE: 'http://kths.se/api/wp/v2/posts',
    PRIMARY_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/348',
    SECONDARY_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/348',
    SECTIONS_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/354',
    FOOTER_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/352',
    LANGUAGE: 'en'
};
