

export interface IType {
  name: string;
  slug: string;
}


export type TTypeQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
