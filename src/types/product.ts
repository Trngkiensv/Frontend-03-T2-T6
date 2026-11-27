export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
}
export type ProductResponse = Product[] | { products: Product[] };

export interface ProductDetailData extends Product {
  colors: {
    id: string;
    name: string;
    hex: string;
    images: string[];
  }[];
  sizes: string[];
  variants: {
    colorId: string;
    size: string;
    stock: number;
  }[];
}