import { Types } from "mongoose";

type TFlavorStatus = "visible" | "hidden";


export interface IFlavor {
   name: string;
   typeId: Types.ObjectId;
   slug: string;
   status: TFlavorStatus
}


export type TFlavorQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  typeId?: string;
  status?: TFlavorStatus
};
