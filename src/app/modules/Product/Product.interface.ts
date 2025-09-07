import { Types } from "mongoose";

export type TStockStatus = 'in_stock' | 'stock_out' | 'up_coming';

export interface IProduct {
  name: string;
  slug: string;
  typeId: Types.ObjectId;
  categoryId: Types.ObjectId;
  brandId?: Types.ObjectId;
  flavorId?: Types.ObjectId;
  currentPrice: number;
  originalPrice?: number;
  quantity: number;
  discount: string;
  ratings: number;
  total_sold: number;
  isFeatured: boolean;
  status: "visible" | "hidden";
  stockStatus: TStockStatus;
  image: string;
  description: string;
};

export type TProductQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: "visible" | "hidden";
  stockStatus?: TStockStatus;
  typeId?:string;
  categoryId?: string;
  brandId?: string;
  flavorId?: string;
  ratings?:string;
  fromPrice?: string;
  toPrice?: string;
};

