

export interface IFlavor {
  name: string;
  slug: string;
}


export type TFlavorQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
