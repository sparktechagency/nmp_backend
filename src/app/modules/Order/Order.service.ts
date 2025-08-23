import ApiError from '../../errors/ApiError';
import { OrderSearchableFields } from './Order.constant';
import { IOrder, IShipping, TOrderQuery, TUserOrderQuery } from './Order.interface';
import OrderModel from './Order.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import CartModel from '../Cart/Cart.model';
import ObjectId from '../../utils/ObjectId';
import mongoose, { Types } from "mongoose";
import generateTransactionId from '../../utils/generateTransactionId';
import Stripe from 'stripe';
import config from '../../config';
import ProductModel from '../Product/Product.model';

const stripe = new Stripe(config.stripe_secret_key as string);


const createOrderService = async (
  loginUserId: string,
  userEmail: string,
  payload: IShipping
) => {


  const carts = await CartModel.aggregate([
    {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    {
      $project: {
        _id:0,
        userId: 0,
        createdAt:0,
        updatedAt:0
      }
    }
  ]);

  if(carts?.length===0){
    throw new ApiError(404, "No items in cart.")
  }
  
  //count totalPrice
  const totalPrice = carts?.reduce((total, currentValue)=>total+ (currentValue.price*currentValue.quantity), 0);
  const cartProducts = carts?.map((cv) => ({
    ...cv,
    total: Number(cv.price) * Number(cv.quantity)
  }))

  

  const lineItems = cartProducts?.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100, // price in cents
    },
    quantity: product.quantity,
  }));

   //generate token
  const token = Math.floor(100000 + Math.random() * 900000);

  //generate transactionId
  const transactionId = generateTransactionId();
  

     //transaction & rollback
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();

      // update product sales in bulk
      //bulkWrite send one request to MongoDB:
      await ProductModel.bulkWrite(
        cartProducts.map(item => ({
          updateOne: {
            filter: { _id: item.productId },
            update: { $inc: { total_sold: item.quantity } },
          }
        })),
        { session }
      );

      //delete from cart list
      await CartModel.deleteMany(
        { userId: new ObjectId(loginUserId) },
        { session }
      );
  
      const order = await OrderModel.create([
        {
          userId: loginUserId,
          token,
          products: cartProducts,
          totalPrice,
          transactionId,
          shipping: payload
        }
      ], {session});

      //create payment session
        const paymentSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          metadata: {
            orderId: (order[0]._id).toString(),
            userId: loginUserId
          },
          customer_email: userEmail,
          client_reference_id: (order[0]._id).toString(),
          success_url: `${config.frontend_url}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${config.frontend_url}/cancel`,
        });
  
      //transaction success
      await session.commitTransaction();
      await session.endSession();
      return {
        url: paymentSession.url
      };
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }

};

const getUserOrdersService = async (loginUserId: string, query: TUserOrderQuery) => {
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


  const result = await OrderModel.aggregate([
    {
      $match: {
        userId: new ObjectId(loginUserId)
      }
    },
    { $skip: skip },
    { $limit: Number(limit) },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "reviews",
        let: {
          productId: "$products.productId",
          orderId: "$_id",
          userId: new ObjectId(loginUserId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$orderId", "$$orderId"] },
                  { $eq: ["$userId", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "products.reviews",
      },
    },
    {
      $addFields: {
        "products.isReview": {
          $cond: {
            if: { $gt: [{ $size: "$products.reviews" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        token: { $first: "$token" },
        userId: { $first: "$userId" },
        totalPrice: { $first: "$totalPrice" },
        paymentStatus: { $first: "$paymentStatus" },
        status: { $first: "$status" },
        deliveryAt: { $first: "$deliveryAt" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        products: { $push: "$products" }
      }
    },
    {
      $project: {
        _id: 1,
        token: 1,
        totalPrice: 1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        createdAt: 1,
        products: {
          $map: {
            input: "$products",
            as: "product",
            in: {
              productId: "$$product.productId",
              name: "$$product.name",
              price: "$$product.price",
              quantity: "$$product.quantity",
              total: "$$product.total",
              image: "$$product.image",
              isReview: "$$product.isReview"
            }
          }
        }
      }
    },
    { $sort: { [sortBy]: sortDirection } },
  ]);

  // total count
  const totalCountResult = await OrderModel.aggregate([
     {
      $match: {
        userId: new ObjectId(loginUserId)
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


const getAllOrdersService = async (query: TOrderQuery) => {
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
    searchQuery = makeSearchQuery(searchTerm, OrderSearchableFields);
  }

  //5 setup filters
  let filterQuery = {};
  if (filters) {
    filterQuery = makeFilterQuery(filters);
  }
  const result = await OrderModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        token:1,
        totalPrice:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count result
  const totalCountResult = await OrderModel.aggregate([
     {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        token:1,
        fullName: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    {
      $match: {
        ...searchQuery,
        ...filterQuery
      },
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

const getSingleOrderService = async (orderId: string) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "orderId must be a valid ObjectId")
  }

  const result = await OrderModel.aggregate([
    {
      $match: {
        _id: new ObjectId(orderId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        token:1,
        customerName: "$user.fullName",
        customerEmail: "$user.email",
        customerPhone: "$user.phone",
        shipping:1,
        totalPrice: 1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        products:1,
        createdAt: "$createdAt",
      }
    },
  ]);


  if (result.length===0) {
    throw new ApiError(404, 'orderId Not Found');
  }

  return result[0];
};

const updateOrderService = async (orderId: string, payload: Partial<IOrder>) => {
  if (!Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "orderId must be a valid ObjectId")
  }
  
  const order = await OrderModel.findById(orderId);
  if (!order) {
    throw new ApiError(404, "orderId not found");
  }

  //if status==="delivered"
  if(payload.status==="delivered"){
    if(order.paymentStatus !=="paid"){
      throw new ApiError(403, "This order has not been paid for yet.")
    }
    payload.deliveryAt=new Date()
  }

  const result = await OrderModel.updateOne(
    { _id: orderId },
    payload,
  );

  return result;
};

const deleteOrderService = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  if(!order){
    throw new ApiError(404, "Order Not Found");
  }
  const result = await OrderModel.deleteOne({ _id:orderId });
  return result;
};



const verifySessionService = async (sessionId: string) => {
  if (!sessionId) {
    throw new ApiError(400, "sessionId is required");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    //payment_status = "no_payment_required", "paid", "unpaid"
    if (session.payment_status !== "paid") {
      throw new ApiError(403, "Payment Failled");
    }

    const metadata = session?.metadata;
    if(!metadata){
      throw new ApiError(400, "Invalid Session Id")
    }
    
    //update database base on metadata = session.metadata
    const result = await OrderModel.updateOne({
      _id: metadata.orderId,
      userId: metadata.userId
    }, {
      paymentStatus: "paid"
    })

    return result;
  } catch (err:any) {
    throw new Error(err)
  }
};




export {
  createOrderService,
  getUserOrdersService,
  getAllOrdersService,
  getSingleOrderService,
  updateOrderService,
  deleteOrderService,
  verifySessionService,
};
