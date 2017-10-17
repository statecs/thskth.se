import {InjectionToken} from '@angular/core';
import {AppConfig} from './interfaces/appConfig';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export let appConfig: AppConfig = {
    BASE_URL: 'http://kths.se/',
    API_URL: 'http://kths.se/api/wp/v2/',
    CARDS_URL: 'http://kths.se/api/wp/v2/cards',
    CARD_CATEGORY_ORG: 'http://kths.se/api/wp/v2/organization_type',
    CARD_CATEGORY_PRO: 'http://kths.se/api/wp/v2/profession',
    CARD_CATEGORY_INT: 'http://kths.se/api/wp/v2/user_interest',
    POSTS_PAGE: 'http://kths.se/api/wp/v2/posts',
    PAGES_URL: 'http://kths.se/api/wp/v2/pages',
    PRIMARY_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/348',
    SECONDARY_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/348',
    SECTIONS_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/354',
    FOOTER_MENU_URL: 'http://kths.se/api/wp-api-menus/v2/menus/352',
    LANGUAGE: 'en',
/*    PROFESSION: {student: 367, professor: 368, other: 377},
    ORGANIZATION_TYPE: {company: 375, institute: 376, other: 382},
    USER_INTEREST: {student: 378, education: 380, careers: 379, other: 381},*/
    GOOGLE_CALENDAR_BASE_URL: 'https://www.googleapis.com/calendar/v3/calendars/',
    GOOGLE_CALENDAR_KEY: 'AIzaSyBlXb10kwagd6soG9SCxwN_AOVKbkGzHo0',
    EVENT_IMAGE_BASE_URL: 'https://drive.google.com/uc?export=view&id=',
    FACEBOOK_POST_URL: 'http://ths.kth.se/api/wp/v2/social/facebook',
    INSTAGRAM_POST_URL: 'http://ths.kth.se/api/wp/v2/social/instagram',
    THS_FACEBOOK_USER_ID: '121470594571005',
    ARMADA_FACEBOOK_USER_ID: '148731426526',
    FAQ_CATEGORIES_URL: 'http://kths.se/api/wp/v2/faq_category',
    FAQs_URL: 'http://kths.se/api/wp/v2/ths-faqs',
    PRIMARY_SLIDES_URL: 'http://kths.se/api/wp/v2/slides',
    NOTIFICATION_URL: 'http://kths.se/api/wp/v2/notification',
    ARCHIVE_URL: 'http://kths.se/api/wp/v2/documents',
    ASSOCIATION_URL: 'http://kths.se/api/wp/v2/association',
    CHAPTER_URL: 'http://kths.se/api/wp/v2/chapter',
    RESTAURANT_URL: 'http://kths.se/api/wp/v2/restaurant',
    CATEGORIES_URL: 'http://kths.se/api/wp/v2/categories',
    RECAPTCHA_PUBLICKEY: '6Lf68iYTAAAAAIFMPKffFO9vYNJ7KRgQVWP9H_ac',
    XHR_CONTACT_FORM: 'http://kths.se/assets/scripts/xhr-contact-form.php',
};
