

export interface IInformation {
  title: string;
  subTitle: string;
  email: string;
  phone: string;
  address: string;
  instagram: string;
  facebook: string;
  heroImg: string;
};

export type TContactQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
