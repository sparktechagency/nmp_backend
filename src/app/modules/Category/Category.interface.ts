import { Types } from "mongoose";

type TCategoryStatus = "visible" | "hidden";

export interface ICategory {
  name: string;
  typeId: Types.ObjectId;
  slug: string;
  status: TCategoryStatus
}


export type TCategoryQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  typeId?: string;
  status?: TCategoryStatus
};
