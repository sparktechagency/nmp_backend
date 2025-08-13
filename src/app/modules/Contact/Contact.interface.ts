

export interface IContact {
  name: string;
  email: string;
  phone: string;
  message: string;
  replyText?: string;
  replyAt?: Date;
};

export type TContactQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
