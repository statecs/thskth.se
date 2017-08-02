interface User {
    name: string;
    profile_image: string;
    link: string;
}

export interface SocialMediaPost {
    created_time: number;
    message: string;
    full_picture: string;
    link: string;
    host: string;
    user: User;
}
