import { Types } from "mongoose";

type TBrandStatus = "visible" | "hidden";

export interface IBrand {
  name: string;
  slug: string;
  typeId: Types.ObjectId;
  status: TBrandStatus
}


export type TBrandQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  typeId?: string;
  status?: TBrandStatus
};
