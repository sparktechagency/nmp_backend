import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import pickValidFields from '../../utils/pickValidFields';
import { BestSellerValidFields, ProductValidFields, UserProductValidFields } from './Product.constant';
import CreateProductService from './service/CreateProductService';
import GetSingleProductService from './service/GetSingleProductService';
import GetUserProductsService from './service/GetUserProductsService';
import GetProductsService from './service/GetProductsService';
import getProductService from './service/GetProductService';
import UpdateProductService from './service/UpdateProductService';
import UpdateProductImgService from './service/UpdateProductImgService';
import DeleteProductService from './service/DeleteProductService';
import GetBestSellerProductsService from './service/GetBestSellerProductsService';
import GetFeatureProductsService from './service/GetFeatureProductsService';

const createProduct = catchAsync(async (req, res) => {
  const result = await CreateProductService(req, req.body);

 return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product is created successfully',
    data: result,
  });
});


const getSingleProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await GetSingleProductService(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is retrieved successfully',
    data: result,
  });
});

const getProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await getProductService(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is retrieved successfully',
    data: result,
  });
});

const getUserProducts = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, UserProductValidFields);
  const result = await GetUserProductsService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getBestSellerProducts = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, BestSellerValidFields);
  const result = await GetBestSellerProductsService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getFeatureProducts = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, BestSellerValidFields);
  const result = await GetFeatureProductsService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getProducts = catchAsync(async (req, res) => {
  const validatedQuery = pickValidFields(req.query, ProductValidFields);
  const result = await GetProductsService(validatedQuery);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products are retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await UpdateProductService(productId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is updated successfully',
    data: result,
  });
});
const updateProductImg = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await UpdateProductImgService(req, productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Product's image is updated successfully`,
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await DeleteProductService(productId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product is deleted successfully',
    data: result,
  });
});

const ProductController = {
  createProduct,
  getSingleProduct,
  getProduct,
  getUserProducts,
  getBestSellerProducts,
  getFeatureProducts,
  getProducts,
  updateProduct,
  updateProductImg,
  deleteProduct,
};
export default ProductController;
