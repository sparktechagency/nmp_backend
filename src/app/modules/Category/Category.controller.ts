import catchAsync from "../../utils/catchAsync";
import pickValidFields from "../../utils/pickValidFields";
import sendResponse from "../../utils/sendResponse";
import { CategoryValidFields } from "./Category.constant";
import { createCategoryService, deleteCategoryService, getCategoriesService, getCategoryDropDownService, getExportCategoriesService, updateCategoryService } from "./Category.service";


const createCategory = catchAsync(async (req, res) => {
  const result = await createCategoryService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category is created successfully",
    data: result
  });
});


const getCategories = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, CategoryValidFields);
  const result = await getCategoriesService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getExportCategories = catchAsync(async (req, res) => {
  const result = await getExportCategoriesService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Categories are retrieved successfully',
    data: result
  });
});


const getCategoryDropDown = catchAsync(async (req, res) => {
  const { typeId } = req.params; 
  const result = await getCategoryDropDownService(typeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories are retrieved successfully",
    data: result
  });
});


const updateCategory = catchAsync(async (req, res) => {
  const { categoryId } = req.params;
  const result = await updateCategoryService(categoryId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category is updated successfully",
    data: result
  });
});


const deleteCategory = catchAsync(async (req, res) => {
   const { categoryId } = req.params;
  const result = await deleteCategoryService(categoryId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category is deleted successfully",
    data: result
  });
});


const CategoryController = {
  createCategory,
  getCategories,
  getExportCategories,
  getCategoryDropDown,
  updateCategory,
  deleteCategory
}

export default CategoryController;