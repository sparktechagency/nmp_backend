

export interface IUser {
  fullName: string;
  email: string;
  phone: string;
  address?: string; //for admin
  password: string;
  isVerified: boolean;
  passwordChangedAt?: Date;
  role: "user" | "admin" | "super_admin";
  status: "blocked" | "unblocked";
  profile_img?: string;
  otp: string;
  otpExpires: Date,
  resetOtp: string;
  resetOtpstatus: number;
  resetOtpExpires: Date,
}


export type TUserQuery = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string,
};
