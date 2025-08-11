import UserModel from "./user.model";
import { IUser, TUserQuery } from "./user.interface";
import AppError from "../../errors/ApiError";
import { Request } from "express";
import { makeFilterQuery, makeSearchQuery } from "../../helper/QueryBuilder";
import { UserSearchFields } from "./user.constant";
import ObjectId from "../../utils/ObjectId";
import isValidYearFormat from "../../utils/isValidateYearFormat";
import ApiError from "../../errors/ApiError";


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
        gender:1,
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


const getSingleUserService = async (userId: string) => {
  const user = await UserModel.findById(userId).select('-role -status -address');
  if(!user){
    throw new AppError(404, "No User Found");
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


const getMeService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("fullName email phone");
  if(!user){
    throw new AppError(404, "No User Found");
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
    throw new AppError(400, "image is required");
  }

  //uploaded-image
  //const image = await uploadImage(req);
  
  const result = await UserModel.updateOne(
    { _id: loginUserId },
    { profileImg : "image" }
  )

  return result;

};


const getUserOverviewService = async (year: string) => {
  if(!isValidYearFormat(year)){
    throw new ApiError(400, "Invalid year, year should be in 'YYYY' format.")
  }

  const start = `${year}-01-01T00:00:00.000+00:00`;
  const end = `${year}-12-31T00:00:00.000+00:00`;

  const result = await UserModel.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(start), $lte: new Date(end) },
        role: "user"
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        users: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              "",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            "$_id.month",
          ],
        },
      },
    },
    {
      $project: {
        _id:0
      }
    }
  ])

  //Fill in missing months
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const filledData = allMonths.map((month) => {
    const found = result?.find((item) => item.month === month);
    return {
      month,
      users: found ? found.users : 0
    };
  });
 
  return filledData;
}


export {
  getUsersService,
  getSingleUserService,
  getMeForSuperAdminService,
  getMeService,
  editMyProfileService,
  updateProfileImgService,
  getUserOverviewService,
};
