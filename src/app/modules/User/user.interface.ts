

export interface IUser {
  fullName: string;
  email: string;
  phone: string;
  address?: string; //for admin
  password: string;
  isVerified: boolean;
  verificationToken: string;
  passwordChangedAt?: Date;
  role: "user" | "admin" | "super_admin";
  status: "blocked" | "unblocked";
}


export type TUserQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
