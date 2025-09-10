
import ApiError from '../../errors/ApiError';
import { ShippingCostSearchableFields } from './ShippingCost.constant';
import { IShippingCost, TShippingCostQuery } from './ShippingCost.interface';
import ShippingCostModel from './ShippingCost.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import calculateShippingCost from '../../utils/calculateShippingCost';

const createShippingCostService = async (
  payload: IShippingCost,
) => {
  //const cost = await calculateShippingCost(130);

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
    {
      $project: {
        _id: 1,
        fullName: 1,
        email: 1,
        phone: 1,
        gender:1,
        role: 1,
        status: 1,
        profileImg: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
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
  updateShippingCostService,
  deleteShippingCostService,
};
