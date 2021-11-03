/* eslint-disable no-unused-vars */
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

export type User = {
  id: string;
  username: string;
  password: string;
  fullname: string;
  role: string;
};

export type Notif = {
  id: string;
  status: string;
  type: string;
  note: string;
  user: User;
  notifCarts: NotifCart[];
};

export type NotifCart = {
  id: string;
  productName: string;
  productCategory: string;
  productQuantity: number;
  productCode: string;
};

export enum ERule {
  ALLOW = 'ALLOW',
  PREVENT = 'PREVENT',
}
export enum ERole {
  KSBU = 'KSBU',
  USER = 'USER',
  RT = 'RT',
}

export enum EStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NOTHING = 'NOTHING ',
  READY = 'READY ',
  INSTRUCTION = 'INSTRUCTION ',
  PURE = 'PURE ',
  KSBU = 'KSBU',
}
