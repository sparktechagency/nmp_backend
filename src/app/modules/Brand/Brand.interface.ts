

export interface IBrand {
  name: string;
  slug: string;
}


export type TBrandQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
