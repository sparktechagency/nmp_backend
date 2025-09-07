import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createTypeService, deleteTypeService, getTypesService, getTypeDropDownService, updateTypeService, getFilterOptionsService } from "./Type.service";


const createType = catchAsync(async (req, res) => {
  const { name } = req.body;
  const result = await createTypeService(name);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Type is created successfully",
    data: result
  });
});


const getTypes = catchAsync(async (req, res) => {
  const result = await getTypesService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Types are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});


const getTypeDropDown = catchAsync(async (req, res) => {
  const result = await getTypeDropDownService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Types are retrieved successfully",
    data: result
  });
});

const getFilterOptions = catchAsync(async (req, res) => {
  const { typeId } = req.params;
  const result = await getFilterOptionsService(typeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Types are retrieved successfully",
    data: result
  });
});


const updateType = catchAsync(async (req, res) => {
  const { typeId } = req.params;
  const { name } = req.body;
  const result = await updateTypeService(typeId, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Type is updated successfully",
    data: result
  });
});


const deleteType = catchAsync(async (req, res) => {
   const { typeId } = req.params;
  const result = await deleteTypeService(typeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Type is deleted successfully",
    data: result
  });
});


const TypeController = {
  createType,
  getTypes,
  getTypeDropDown,
  updateType,
  deleteType,
  getFilterOptions
}

export default TypeController;