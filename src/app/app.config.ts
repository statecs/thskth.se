import {InjectionToken} from '@angular/core';
import {AppConfig} from './interfaces/appConfig';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export let appConfig: AppConfig = {
        BASE_URL: 'http://kths.se/',
        API_URL: 'http://kths.se/api/wp/v2/',
        POSTS_PAGE: 'http://kths.se/api/wp/v2/posts'
    };
