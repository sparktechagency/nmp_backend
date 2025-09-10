

export interface IShippingCost {
  name: string;
  minSubTotal: number;
  maxSubTotal: number;
  cost: number;
  isActive: boolean;
  priority: number;
};

export type TShippingCostQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
