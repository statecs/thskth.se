import {BaseDataInterface} from '../services/abstract-services/base-data.service';
interface User {
    name: string;
    profile_image: string;
    link: string;
}

interface ISocialMediaPost extends BaseDataInterface {
    created_time: string;
    message: string;
    full_picture: string;
    link: string;
    host: string;
    user: User;
}

export class SocialMediaPost implements ISocialMediaPost {
    id: number;
    created_time: string;
    message: string;
    full_picture: string;
    link: string;
    host: string;
    user: User;
}
