import { Request } from "express";
import ApiError from "../../errors/ApiError";
import UserModel from "../User/user.model";
import config from "../../config";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { TAdminQuery } from "./admin.interface";
import { AdminSearchFields } from "./admin.constant";
import { Types } from 'mongoose'; 
import { IUser } from "../User/user.interface";


const createAdminService = async (req:Request, payload:any) => {
    const { email, password } = payload;
    const user = await UserModel.findOne({ email });
    if (user) {
        throw new ApiError(409, 'This Email is already existed')
    }

    if(!password){
        payload.password=config.admin_default_password as string;
    }
    
    //create admin
    const result = await UserModel.create({
      ...payload,
      role: "admin",
      isVerified: true,
      otp:"000000"
    });

    const { _id, fullName, email:Email, phone, role } = result;
    return {
      _id,
      fullName,
      email: Email,
      phone,
      role
    };

}



const getAdminsService = async (query: TAdminQuery) => {
  // 1. Extract query parameters
  const {
    searchTerm,
    page = 1,
    limit = 10,
    sortOrder = "desc",
    sortBy = "createdAt",
    ...filters  // Any additional filters
  } = query;

  // 2. Set up pagination
  const skip = (Number(page) - 1) * Number(limit);

  //3. setup sorting
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  //4. setup searching
  let searchQuery = {};
  if (searchTerm) {
    searchQuery = makeSearchQuery(searchTerm, AdminSearchFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }

  const result = await UserModel.aggregate([
    {
      $match: {
        role: "admin",
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    { $sort: { [sortBy]: sortDirection } },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        gender: 1,
        status: 1
      },
    },
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  // total count of matching users
  const totalCount = await UserModel.countDocuments({
    role: "admin",
    ...searchQuery,
    ...filterQuery,
  });

  return {
    meta: {
      page: Number(page), //currentPage
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / Number(limit)),
      total: totalCount,
    },
    data: result,
  };

};



const deleteAdminService = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "adminId must be a valid ObjectId")
  }
  const adminUser = await UserModel.findById(userId);
  if(!adminUser){
    throw new ApiError(404, "adminId Not Found");
  }
  const result = await UserModel.deleteOne({ _id:userId });
  return result;
}


const updateAdminService = async (userId: string, payload: Partial<IUser>) => {
  const admin = await UserModel.findById(userId);
  if(!admin){
    throw new ApiError(404, "Admin Not Found");
  }
  const result = UserModel.updateOne(
    { _id: userId },
    payload
  )

  return result;
}

export {
    createAdminService,
    updateAdminService,
    getAdminsService,
    deleteAdminService,
}