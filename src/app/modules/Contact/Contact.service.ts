
import ApiError from '../../errors/ApiError';
import { ContactSearchableFields } from './Contact.constant';
import { IContact, TContactQuery } from './Contact.interface';
import ContactModel from './Contact.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import { Types } from "mongoose";
import sendReplyEmail from '../../utils/sendReplyEmail';

const createContactService = async (
  payload: IContact,
) => {
  const result = await ContactModel.create(payload);
  return result;
};

const getAllContactsService = async (query: TContactQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, ContactSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await ContactModel.aggregate([
    {
      $match: {
        ...searchQuery, 
        ...filterQuery
      },
    },
    {
      $project: {
        updatedAt: 0
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

     // total count
  const totalCountResult = await ContactModel.aggregate([
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


const replyContactService = async (contactId: string, replyText: string) => {
  if (!Types.ObjectId.isValid(contactId)) {
    throw new ApiError(400, "contactId must be a valid ObjectId")
  }
  const contact = await ContactModel.findById(contactId);
  if (!contact) {
    throw new ApiError(404, "contactId Not Found");
  }

  if(contact.replyText){
    throw new ApiError(409, "Reply already sent.")
  }
 
  //update contact
  const result = await ContactModel.updateOne(
    { _id: contactId },
    { replyText, replyAt: new Date() }
  );

  //send reply message
  await sendReplyEmail(contact.email, replyText);
  return result;
};

const deleteContactService = async (contactId: string) => {
  if (!Types.ObjectId.isValid(contactId)) {
    throw new ApiError(400, "contactId must be a valid ObjectId")
  }
  const contact = await ContactModel.findById(contactId);
  if(!contact){
    throw new ApiError(404, "contactId Not Found");
  }
  const result = await ContactModel.deleteOne({ _id:contactId });
  return result;
};

export {
  createContactService,
  getAllContactsService,
  replyContactService,
  deleteContactService,
};
