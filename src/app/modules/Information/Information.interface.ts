

export interface IInformation {
  email: string;
  phone: string;
  address: string;
  instagram: string;
  telegram: string;
};

export type TContactQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
