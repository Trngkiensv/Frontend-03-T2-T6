export interface Banner {
  id: number;
  title: string;
  image: string;
}

export type BannerResponse = Banner[] | { banners: Banner[] };