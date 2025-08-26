// types/blog.ts
export interface WordPressPost {
    id: number;
    date: string;
    date_gmt: string;
    guid: {
    rendered: string;
    };
    modified: string;
    modified_gmt: string;
    slug: string;
    status: string;
    type: string;
    link: string;
    title: {
    rendered: string;
    };
    content: {
    rendered: string;
    protected: boolean;
    };
    excerpt: {
    rendered: string;
    protected: boolean;
    };
    author: number;
    featured_media: number;
    comment_status: string;
    ping_status: string;
    sticky: boolean;
    template: string;
    format: string;
    meta: {
    advanced_seo_description: string;
    jetpack_seo_noindex: boolean;
    jetpack_post_was_ever_published: boolean;
    };
    categories: number[];
    tags: number[];
    class_list: string[];
    jetpack_featured_media_url: string;
    jetpack_likes_enabled: boolean;
    jetpack_sharing_enabled: boolean;
    jetpack_shortlink: string;
    "jetpack-related-posts": any[];
    jetpack_publicize_connections: any[];
    links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    [key: string]: any;
    };
}

export interface BlogPost {
    id: number;
    title: string;
    subtitle: string;
    content: string;
    excerpt: string;
    image: string;
    author: string;
    date: string;
    readTime: string;
    views: number;
    likes: number;
    isLiked?: boolean;
    slug: string;
    link: string;
    categories: number[];
    tags: number[];
}

export interface BlogApiResponse {
    posts: BlogPost[];
    total: number;
    totalPages: number;
}

export interface BlogApiParams {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    orderby?: 'date' | 'modified' | 'title' | 'author';
    order?: 'asc' | 'desc';
}