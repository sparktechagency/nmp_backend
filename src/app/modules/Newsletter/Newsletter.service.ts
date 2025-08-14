
import ApiError from '../../errors/ApiError';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import { NewsletterSearchableFields } from './Newsletter.constant';
import { INewsletter, TNewsletterQuery } from './Newsletter.interface';
import NewsletterModel from './Newsletter.model';
import { Types } from "mongoose";

const subscribeToNewsletterService = async (
  payload: INewsletter,
) => {
  const newsletter = await NewsletterModel.findOne({ email: payload.email });
  if(newsletter){
    const result = await NewsletterModel.updateOne(
      { email: payload.email },
      { subscribedAt: new Date()}
    );
    return result;
  }

  const result = await NewsletterModel.create(payload);
  return result;
};


const getSubscribersService = async (query: TNewsletterQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, NewsletterSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await NewsletterModel.aggregate([
    {
      $match: {
        ...searchQuery, 
        ...filterQuery
      },
    },
     { $sort: { [sortBy]: sortDirection } }, 
    {
      $project: {
        createdAt:0,
        updatedAt: 0
      },
    },
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalCountResult = await NewsletterModel.aggregate([
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      }
    },
    { $count: "totalCount" }
  ])

  const totalCount = totalCountResult[0]?.totalCount || 0;
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


const deleteSubsciberService = async (subscriberId: string) => {
  if (!Types.ObjectId.isValid(subscriberId)) {
    throw new ApiError(400, "subscriberId must be a valid ObjectId")
  }
  const subscriber = await NewsletterModel.findById(subscriberId);
  if(!subscriber){
    throw new ApiError(404, "subscriberId Not Found");
  }
  const result = await NewsletterModel.deleteOne({ _id:subscriberId });
  return result;
};

export {
  subscribeToNewsletterService,
  getSubscribersService,
  deleteSubsciberService
};
