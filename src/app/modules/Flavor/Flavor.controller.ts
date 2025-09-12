import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createFlavorService, deleteFlavorService, getFlavorsService, getFlavorDropDownService, updateFlavorService, getExportFlavorsService } from "./Flavor.service";


const createFlavor = catchAsync(async (req, res) => {
  const result = await createFlavorService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Flavor is created successfully",
    data: result
  });
});


const getFlavors = catchAsync(async (req, res) => {
  const result = await getFlavorsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Flavors are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getExportFlavors = catchAsync(async (req, res) => {
  const result = await getExportFlavorsService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Flavors are retrieved successfully',
    data: result
  });
});


const getFlavorDropDown = catchAsync(async (req, res) => {
  const { typeId } = req.params;
  const result = await getFlavorDropDownService(typeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Flavors are retrieved successfully",
    data: result
  });
});


const updateFlavor = catchAsync(async (req, res) => {
  const { flavorId } = req.params;
  const result = await updateFlavorService(flavorId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Flavor is updated successfully",
    data: result
  });
});


const deleteFlavor = catchAsync(async (req, res) => {
   const { flavorId } = req.params;
  const result = await deleteFlavorService(flavorId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Flavor is deleted successfully",
    data: result
  });
});


const FlavorController = {
  createFlavor,
  getFlavors,
  getExportFlavors,
  getFlavorDropDown,
  updateFlavor,
  deleteFlavor
}

export default FlavorController;