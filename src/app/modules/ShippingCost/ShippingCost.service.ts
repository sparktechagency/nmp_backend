
import ApiError from '../../errors/ApiError';
import { ShippingCostSearchableFields } from './ShippingCost.constant';
import { IShippingCost, TShippingCostQuery } from './ShippingCost.interface';
import ShippingCostModel from './ShippingCost.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import slugify from 'slugify';
import CartModel from '../Cart/Cart.model';
import ObjectId from '../../utils/ObjectId';
import calculateShippingCost from '../../utils/calculateShippingCost';

const createShippingCostService = async (
  payload: IShippingCost,
) => {
  const { name, priority } = payload;
  //make slug
  const slug = slugify(name).toLowerCase();
  payload.slug = slug;

  //check shipping cost name is already existed
  const existingName = await ShippingCostModel.findOne({
    slug
  });

  if (existingName) {
    throw new ApiError(409, "This name is already taken.")
  }


  //check priority
  const existingPriority = await ShippingCostModel.findOne({
    priority
  });

  if (existingPriority) {
    throw new ApiError(409, "Priority can not be same")
  }

  const result = await ShippingCostModel.create(payload);
  return result;
};


const getAllShippingCostsService = async (query: TShippingCostQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, ShippingCostSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ShippingCostModel.aggregate([
    {
      $match: {
        ...searchQuery, // Apply search query
        ...filterQuery, // Apply filters
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    {
      $project: {
        slug:0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalReviewResult = await ShippingCostModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalReviewResult[0]?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / Number(limit));

return {
  meta: {
    page: Number(page), //currentPage
    limit: Number(limit),
    totalPages,
    total: totalCount,
  },
  data: result,
};
};

const getMyShippingCostService = async (loginUserId: string) => {
  const carts = await CartModel.aggregate([
    {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    {
      $project: {
        _id: 0,
        userId: 0,
        createdAt: 0,
        updatedAt: 0
      }
    }
  ]);

  if (carts?.length === 0) {
    throw new ApiError(404, "No items in cart.")
  }
  //count subTotal
  const subTotal = carts?.reduce((total, currentValue) => total + (currentValue.price * currentValue.quantity), 0);

  //count shipping cost
  const shippingCost = await calculateShippingCost(subTotal);

  //count total
  const total = Number(subTotal + shippingCost);
  return {
    subTotal,
    shippingCost,
    total
  }
}

const getSingleShippingCostService = async (shippingcostId: string) => {
  const result = await ShippingCostModel.findById(shippingcostId);
  if (!result) {
    throw new ApiError(404, 'ShippingCost Not Found');
  }

  return result;
};

const updateShippingCostService = async (shippingcostId: string, payload: any) => {
 
  const shippingcost = await ShippingCostModel.findById(shippingcostId);
  if(!shippingcost){
    throw new ApiError(404, "ShippingCost Not Found");
  }
  const result = await ShippingCostModel.updateOne(
    { _id: shippingcostId },
    payload,
  );

  return result;
};

const deleteShippingCostService = async (shippingcostId: string) => {
  const shippingcost = await ShippingCostModel.findById(shippingcostId);
  if(!shippingcost){
    throw new ApiError(404, "ShippingCost Not Found");
  }
  const result = await ShippingCostModel.deleteOne({ _id:shippingcostId });
  return result;
};

export {
  createShippingCostService,
  getAllShippingCostsService,
  getSingleShippingCostService,
  getMyShippingCostService,
  updateShippingCostService,
  deleteShippingCostService,
};
