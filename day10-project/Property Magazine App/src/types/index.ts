export type SanitySlug = { current: string };

export type SanityImageLike =
  | string
  | {
      asset?: { _ref?: string; url?: string };
      url?: string;
      alt?: string;
    };

export type SanityArticleCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: SanityImageLike;
  coverImageUrl: string;
  category?: string;
  isPremium?: boolean;
  publishedAt?: string;
  tags?: string[];
};

export type SanityArticleFull = SanityArticleCard & {
  body?: any;
  seo?: { title?: string; description?: string; keywords?: string[] };
};

export type SanityPropertyCard = {
  _id: string;
  title: string;
  slug: string;
  architect?: string;
  year?: number;
  location?: { city?: string; country?: string; region?: string };
  style?: string[];
  area?: number;
  isPremium?: boolean;
  coverImage?: SanityImageLike;
  coverImageUrl: string;
};

export type SanityPropertyFull = SanityPropertyCard & {
  description?: any;
  gallery?: SanityImageLike[];
  materials?: { name?: string; description?: string; image?: SanityImageLike }[];
};

