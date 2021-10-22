export interface Properties {
  image: string;
  color: string;
}

export interface Categories {
  id: string;
  title: string;
  products: Product[];
  createdAt: Date;
}

export interface Stock {
  id: string;
  description?: string;
  price: number;
  quantity: number;
  product: Product;
  createdAt: Date;
}

export type Product = {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  latestQuantity: number;
  stockDesc: string;
  productDesc: string;
};
