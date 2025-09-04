import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createBrandService, deleteBrandService, getBrandDropDownService, getBrandsService, updateBrandService } from "./Brand.service";


const createBrand = catchAsync(async (req, res) => {
  const result = await createBrandService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Brand is created successfully",
    data: result
  });
});


const getBrands = catchAsync(async (req, res) => {
  const result = await getBrandsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Brands are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});


const getBrandDropDown = catchAsync(async (req, res) => {
  const result = await getBrandDropDownService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brands are retrieved successfully",
    data: result
  });
});


const updateBrand = catchAsync(async (req, res) => {
  const { brandId } = req.params;
  const { name } = req.body;
  const result = await updateBrandService(brandId, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brand is updated successfully",
    data: result
  });
});


const deleteBrand = catchAsync(async (req, res) => {
   const { brandId } = req.params;
  const result = await deleteBrandService(brandId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brand is deleted successfully",
    data: result
  });
});


const BrandController = {
  createBrand,
  getBrands,
  getBrandDropDown,
  updateBrand,
  deleteBrand
}

export default BrandController;