import { Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
  colorId?: Types.ObjectId;
  size?: string;
}

export interface IShipping {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string
};

export type TPaymentStatus = "paid" | "unpaid" | "failled" | "cash";
export type TDeliveryStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder {
  token: string;
  fullName: string;
  email: string;
  phone: string;
  products: IOrderItem[];
  shippingCost: number;
  subTotal: number;
  total: number;
  tips?: number;
  transactionId: string;
  paymentMethod?: string;
  paymentStatus?: TPaymentStatus,
  status: TDeliveryStatus
  deliveryAt?: Date;
  shipping: IShipping
};

export type TOrderQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
export type TUserOrderQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};


export interface ICart {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export type TOrderPayload = {
  userData: {
    fullName: string;
    email: string;
    phone: string;
  },
  shippingAddress: IShipping,
  cartProducts: ICart[]
}