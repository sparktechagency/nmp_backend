import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { AdminValidFields } from "./admin.constant";
import { createAdminService, deleteAdminService, getAdminsService, updateAdminService } from "./admin.service";


const createAdmin = catchAsync(async (req, res) => {
  const result = await createAdminService(req, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin is created successfully",
    data: result,
  });
});



const updateAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await updateAdminService(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is updated successfully",
    data: result,
  });
});


const getAdmins = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, AdminValidFields);
  const result = await getAdminsService(validatedQuery);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admins are retrieved successfully",
    meta: result.meta,
    data: result.data
  });
});


const deleteAdmin = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await deleteAdminService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
});


const AdminController = {
    createAdmin,
    updateAdmin,
    getAdmins,
    deleteAdmin,
};
  
export default AdminController;