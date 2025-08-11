

export interface ICategory {
  name: string;
  slug: string;
}


export type TCategoryQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
