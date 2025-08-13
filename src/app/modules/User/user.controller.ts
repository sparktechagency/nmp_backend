import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { UserValidFields } from "./user.constant";
import { editMyProfileService, getMeForSuperAdminService, getMyProfileService, getSingleUserService, getUserOverviewService, getUsersService, updateProfileImgService } from "./user.service";


const getUsers = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, UserValidFields);
  const result = await getUsersService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});




const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getSingleUserService(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is retrieved successfully",
    data: result
  });
});



const getMeForSuperAdmin = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getMeForSuperAdminService(loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Information is retrieved successfully",
    data: result
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await getMyProfileService(loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Profile is retrieved successfully",
    data: result
  });
});



const editMyProfile = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await editMyProfileService(loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile is updated successfully",
    data: result
  });
});



const updateProfileImg = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await updateProfileImgService(req, loginUserId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Image is updated successfully",
    data: result,
  });
});


const getUserOverview = catchAsync(async (req, res) => {
  const { year } = req.params;
  const result = await getUserOverviewService(year);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User overview is retrieved successfully',
    data: result,
  });
});



const UserController = {
    getUsers,
    getSingleUser,
    getMyProfile,
    getMeForSuperAdmin,
    editMyProfile,
    updateProfileImg,
    getUserOverview,
}

export default UserController;