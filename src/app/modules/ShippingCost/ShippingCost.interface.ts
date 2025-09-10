

export interface IShippingCost {
  name: string;
  description?: string;
};

export type TShippingCostQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
