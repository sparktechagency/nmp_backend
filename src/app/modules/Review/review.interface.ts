import { Types } from "mongoose";


export interface IReview {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  star: Number;
  comment: String;
  hidden: boolean,
}

export interface IReviewPayload {
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  star: Number;
  comment: String;
}

export type TReviewQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  star?:number
};