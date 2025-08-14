
type TNewStatus = 'subscribed' | 'unsubscribed';

export interface INewsletter {
  email: string;
  subscribedAt: Date;
  status: TNewStatus;
};

export type TNewsletterQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
