import UserModel from "./user.model";
import { IUser, TUserQuery } from "./user.interface";

import { Request } from "express";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { UserSearchFields } from "./user.constant";
import ObjectId from "../../utils/ObjectId";
import ApiError from "../../errors/ApiError";
import uploadImage from "../../utils/uploadImage";


const getUsersService = async (query: TUserQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, UserSearchFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }


  const result = await UserModel.aggregate([
    {
      $match: {
        role: "user",
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
        profile_img:1,
        status: 1
      },
    },
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count of matching users
  const totalCount = await UserModel.countDocuments({
    role: "user",
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
}


const getExportUsersService = async () => {
  const result = await UserModel.aggregate([
    {
      $match: {
        role: "user",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
      },
    },
  ]);

  return result;
}


const getSingleUserService = async (userId: string) => {
  const user = await UserModel.findById(userId).select('-role -status -address');
  if(!user){
    throw new ApiError(404, "No User Found");
  }
  return user;
}


const getMeForSuperAdminService = async (userId: string) => {
  const result = await UserModel.aggregate([
    {
      $match: {
        _id: new ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "administrators",
        localField: "_id",
        foreignField: "userId",
        as: "administrator"
      }
    },
  ])
  
  const returnData = {
    fullName: result[0]?.fullName,
    email: result[0]?.email,
    phone: result[0]?.phone,
    role: result[0]?.role,
    profileImg: result[0]?.profileImg,
    access: result[0]?.administrator?.length > 0 ? result[0]?.administrator[0]?.access : ["user", "owner", "restaurant", "settings"]
  }
  return returnData;
}


const getMyProfileService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("fullName email phone profile_img");
  if(!user){
    throw new ApiError(404, "No User Found");
  }
  return user;
}


const editMyProfileService = async (loginUserId: string, payload: Partial<IUser>) => {
  const result = UserModel.updateOne(
    { _id: loginUserId },
    payload,
    { runValidators: true }
  )
  return result;
}


const updateProfileImgService = async (req:Request, loginUserId: string) => {

  if(!req.file){
    throw new ApiError(400, "image is required");
  }

  //uploaded-image
  const image = await uploadImage(req);


  
  const result = await UserModel.updateOne(
    { _id: loginUserId },
    { profile_img : image }
  )

  return result;

};




export {
  getUsersService,
  getSingleUserService,
  getMeForSuperAdminService,
  getMyProfileService,
  editMyProfileService,
  updateProfileImgService,
  getExportUsersService
};
