import { Types } from "mongoose";

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
  typeId?:string;
  categoryId?: string;
  brandId?: string;
  flavorId?: string;
  ratings?:string;
  fromPrice?: string;
  toPrice?: string;
};

