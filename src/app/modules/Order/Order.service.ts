import ApiError from '../../errors/ApiError';
import { OrderSearchableFields } from './Order.constant';
import { ICart, IOrder, TOrderPayload, TOrderQuery, TUserOrderQuery } from './Order.interface';
import OrderModel from './Order.model';
import { makeFilterQuery, makeSearchQuery } from '../../helper/QueryBuilder';
import ObjectId from '../../utils/ObjectId';
import mongoose, { Types } from "mongoose";
import generateTransactionId from '../../utils/generateTransactionId';
import Stripe from 'stripe';
import config from '../../config';
import ProductModel from '../Product/Product.model';
import sendProcessingEmail from '../../utils/sendProcessingEmail';
import sendShippedEmail from '../../utils/sendShippedEmail';
import sendDeliveredEmail from '../../utils/sendDeliveredEmail';
import sendCancelledEmail from '../../utils/sendCancelledEmail';
import calculateShippingCost from '../../utils/calculateShippingCost';
import hasDuplicates from '../../utils/hasDuplicates';

const stripe = new Stripe(config.stripe_secret_key as string);


const createOrderService = async (
  payload: TOrderPayload
) => {

  const { userData: { email, fullName}, shippingAddress, cartProducts } = payload;

  //check duplicate cart products
  const cartProductIds = cartProducts?.map((cv)=> cv.productId);

  if(hasDuplicates(cartProductIds)){
    throw new ApiError(400, "Duplicate products cannot be added to the cart !")
  }
  
  // check product 
  for (let i = 0; i < cartProducts?.length; i++) {
    const product = await ProductModel.findById(cartProducts[i].productId);
    if (!product) {
      throw new ApiError(404, `This '${cartProducts[i].productId}' productId not found`);
    }
  }

  let cartItems: {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string;
  }[] = []

  // check product availability during order
  for (let i = 0; i < cartProducts?.length; i++) {
    const product = await ProductModel.findById(cartProducts[i].productId);
    const availableQty = Number(product?.quantity);

    if (cartProducts[i].quantity > availableQty) {
      throw new ApiError(
        400,
        availableQty > 0
          ? `Sorry, only ${availableQty} unit(s) of '${product?.name}' are left in stock. Please update your order.`
          : `Sorry, "${product?.name}" is currently out of stock.`
      );
    }

    if (product) {
      cartItems.push({
        productId: cartProducts[i].productId,
        name: product?.name,
        price: product?.currentPrice,
        quantity: cartProducts[i].quantity,
        total: Number(product?.currentPrice) * Number(cartProducts[i].quantity),
        image: product?.image
      })
    }
  }


  //count subTotal
  const subTotal = cartItems?.reduce((total, currentValue) => total + (currentValue?.price * currentValue.quantity), 0);
  // //count shipping cost
  const shippingCost = await calculateShippingCost(subTotal);
  //count total
  const total = Number(subTotal + shippingCost);
 
  const lineItems = cartItems?.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100, // price in cents
    },
    quantity: product.quantity,
  }));


    // add shipping as one item for the order
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping Cost",
        },
        unit_amount: shippingCost * 100, // in cents
      },
      quantity: 1,
    });
  }

   //generate token
  const token = Math.floor(100000 + Math.random() * 900000);

  //generate transactionId
  const transactionId = generateTransactionId();
  

     //transaction & rollback
    const session = await mongoose.startSession();
  
    try {
      session.startTransaction();

      const order = await OrderModel.create([
        {
          fullName,
          email,
          token,
          products: cartItems,
          subTotal,
          shippingCost,
          total,
          transactionId,
          shipping: shippingAddress
        }
      ], {session});

      //create payment session
        const paymentSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          metadata: {
            orderId: (order[0]._id).toString(),
            email,
            cartProducts: JSON.stringify(cartProducts)
          },
          customer_email: email,
          client_reference_id: (order[0]._id).toString(),
          success_url: `${config.frontend_url}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
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

const createOrderWithCashService = async (
  payload: TOrderPayload
) => {


  const { userData: { email, fullName}, shippingAddress, cartProducts } = payload;

  //check duplicate cart products
  const cartProductIds = cartProducts?.map((cv)=> cv.productId);

  if(hasDuplicates(cartProductIds)){
    throw new ApiError(400, "Duplicate products cannot be added to the cart !")
  }
  
  // check product 
  for (let i = 0; i < cartProducts?.length; i++) {
    const product = await ProductModel.findById(cartProducts[i].productId);
    if (!product) {
      throw new ApiError(404, `This '${cartProducts[i].productId}' productId not found`);
    }
  }

  let cartItems: {
    productId: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    total: number;
    image: string;
  }[] = []

  // check product availability during order
  for (let i = 0; i < cartProducts?.length; i++) {
    const product = await ProductModel.findById(cartProducts[i].productId);
    const availableQty = Number(product?.quantity);

    if (cartProducts[i].quantity > availableQty) {
      throw new ApiError(
        400,
        availableQty > 0
          ? `Sorry, only ${availableQty} unit(s) of '${product?.name}' are left in stock. Please update your order.`
          : `Sorry, "${product?.name}" is currently out of stock.`
      );
    }

    if (product) {
      cartItems.push({
        productId: cartProducts[i].productId,
        name: product?.name,
        price: product?.currentPrice,
        quantity: cartProducts[i].quantity,
        total: Number(product?.currentPrice) * Number(cartProducts[i].quantity),
        image: product?.image
      })
    }
  }


  //count subTotal
  const subTotal = cartItems?.reduce((total, currentValue) => total + (currentValue?.price * currentValue.quantity), 0);
  // //count shipping cost
  const shippingCost = await calculateShippingCost(subTotal);
  //count total
  const total = Number(subTotal + shippingCost);
 
  const lineItems = cartItems?.map((product) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100, // price in cents
    },
    quantity: product.quantity,
  }));


    // add shipping as one item for the order
  if (shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Shipping Cost",
        },
        unit_amount: shippingCost * 100, // in cents
      },
      quantity: 1,
    });
  }

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
        cartProducts.map((item: ICart) => ({
          updateOne: {
            filter: { _id: item.productId },
            update: [
              {
                $set: {
                  quantity: {
                    $max: [
                      { $subtract: ["$quantity", item.quantity] }, //quantity can't be negative, but 0
                      0
                    ]
                  }
                }
              }
            ],
          }
        })),
        { session }
      );

      //create an order
      await OrderModel.create([
        {
          fullName,
          email,
          token,
          products: cartItems,
          subTotal,
          shippingCost,
          paymentStatus: "cash",
          total,
          transactionId,
          shipping: shippingAddress
        }
      ], {session});

      //transaction success
      await session.commitTransaction();
      await session.endSession();
      return null;
    } catch (err: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
    }

};

// const createOrderService = async (
//   loginUserId: string,
//   userEmail: string,
//   payload: IShipping
// ) => {


//   const carts = await CartModel.aggregate([
//     {
//       $match: {
//         userId: new ObjectId(loginUserId)
//       }
//     },
//     {
//       $project: {
//         _id:0,
//         userId: 0,
//         createdAt:0,
//         updatedAt:0
//       }
//     }
//   ]);

//   if(carts?.length===0){
//     throw new ApiError(404, "No items in cart.")
//   }
  
//   //count subTotal
//   const subTotal = carts?.reduce((total, currentValue) => total + (currentValue.price * currentValue.quantity), 0);

//   //count shipping cost
//   const shippingCost = await calculateShippingCost(subTotal);

//   //count total
//   const total = Number(subTotal + shippingCost);

//   const cartProducts = carts?.map((cv) => ({
//     ...cv,
//     total: Number(cv.price) * Number(cv.quantity)
//   }))



//   // check product availability during order
//   for (let i = 0; i < cartProducts?.length; i++) {
//     const product = await ProductModel.findById(cartProducts[i].productId);
//     const availableQty = Number(product?.quantity);

//     if (cartProducts[i].quantity > availableQty) {
//       throw new ApiError(
//         400,
//         availableQty > 0
//           ? `Sorry, only ${availableQty} unit(s) of '${product?.name}' are left in stock. Please update your order.`
//           : `Sorry, "${product?.name}" is currently out of stock.`
//       );
//     }
//   }

  

//   const lineItems = cartProducts?.map((product) => ({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: product.name,
//       },
//       unit_amount: product.price * 100, // price in cents
//     },
//     quantity: product.quantity,
//   }));


//     // add shipping as one item for the order
//   if (shippingCost > 0) {
//     lineItems.push({
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: "Shipping Cost",
//         },
//         unit_amount: shippingCost * 100, // in cents
//       },
//       quantity: 1,
//     });
//   }

//    //generate token
//   const token = Math.floor(100000 + Math.random() * 900000);

//   //generate transactionId
//   const transactionId = generateTransactionId();
  

//      //transaction & rollback
//     const session = await mongoose.startSession();
  
//     try {
//       session.startTransaction();

//       // update product sales in bulk
//       //bulkWrite send one request to MongoDB:
//       await ProductModel.bulkWrite(
//         cartProducts.map(item => ({
//           updateOne: {
//             filter: { _id: item.productId },
//             update: { $inc: { total_sold: item.quantity, quantity: -item.quantity } },
//           }
//         })),
//         { session }
//       );

//       //delete from cart list
//       await CartModel.deleteMany(
//         { userId: new ObjectId(loginUserId) },
//         { session }
//       );
  
//       const order = await OrderModel.create([
//         {
//           userId: loginUserId,
//           token,
//           products: cartProducts,
//           subTotal,
//           shippingCost,
//           total,
//           transactionId,
//           shipping: payload
//         }
//       ], {session});

//       //create payment session
//         const paymentSession = await stripe.checkout.sessions.create({
//           payment_method_types: ["card"],
//           line_items: lineItems,
//           mode: "payment",
//           metadata: {
//             orderId: (order[0]._id).toString(),
//             userId: loginUserId
//           },
//           customer_email: userEmail,
//           client_reference_id: (order[0]._id).toString(),
//           success_url: `${config.frontend_url}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
//           cancel_url: `${config.frontend_url}/cancel`,
//         });
  
//       //transaction success
//       await session.commitTransaction();
//       await session.endSession();
//       return {
//         url: paymentSession.url
//       };
//     } catch (err: any) {
//       await session.abortTransaction();
//       await session.endSession();
//       throw new Error(err);
//     }

// };

const getUserOrdersService = async (userEmail: string, query: TUserOrderQuery) => {
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
        email: userEmail
      }
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "reviews",
        let: {
          productId: "$products.productId",
          orderId: "$_id",
         email: userEmail
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$orderId", "$$orderId"] },
                  { $eq: ["$email", "$$email"] },
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
        subTotal: { $first: "$subTotal" },
        shippingCost: { $first: "$shippingCost" },
        total: { $first: "$total" },
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
        subTotal: 1,
        shippingCost:1,
        total: 1,
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
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count
  const totalCountResult = await OrderModel.aggregate([
     {
      $match: {
        email: userEmail
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
      $match: {
        ...searchQuery,
        ...filterQuery
      },
    },
    {
      $project: {
        _id: 1,
        token:1,
        subTotal: 1,
        shippingCost:1,
        total:1,
        fullName: 1,
        email: 1,
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    { $sort: { [sortBy]: sortDirection } }, 
    { $skip: skip }, 
    { $limit: Number(limit) }, 
  ]);

  // total count result
  const totalCountResult = await OrderModel.aggregate([
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

const getExportOrdersService = async () => {

  const result = await OrderModel.aggregate([
    {
      $project: {
        _id: 1,
        token:1,
        subTotal: 1,
        shippingCost:1,
        total:1,
        fullName: 1,
        email: 1,
        status: "$status",
        paymentStatus: "$paymentStatus",
        deliveryAt: "$deliveryAt",
        createdAt: "$createdAt"
      },
    },
    { $sort: { createdAt:1 } }, 
  ]);


  return result;
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
      $project: {
        _id: 1,
        token:1,
        subTotal: 1,
        shippingCost:1,
        total:1,
        customerName: "$fullName",
        customerEmail: "$email",
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
  
  const order = await OrderModel.aggregate([
    {
      $match: {
        _id: new ObjectId(orderId)
      }
    },
     {
      $project: {
        _id: 1,
        token:1,
        customerName: "$fullName",
        customerEmail: "$email",
        shippingCost:1,
        total: 1,
        subTotal: 1,
        paymentStatus: 1,
        status: 1,
        deliveryAt: 1,
        products:1,
        createdAt: "$createdAt",
      }
    },
  ]);


  if (order.length===0) {
    throw new ApiError(404, "orderId not found");
  }


  //if status==="delivered"
  if(payload.status==="delivered"){
    if(order[0].paymentStatus !=="paid"){
      throw new ApiError(403, "This order has not been paid for yet.")
    }
    payload.deliveryAt=new Date()
  }


  const result = await OrderModel.updateOne(
    { _id: orderId },
    payload,
  );


  if(payload.status==="delivered"){
      await sendDeliveredEmail(order[0].customerEmail, order[0])
    return;
  }
  if(payload.status==="processing"){
    await sendProcessingEmail(order[0].customerEmail, order[0])
    return;
  }

  if (payload.status === "shipped") {
    await sendShippedEmail(order[0].customerEmail, order[0])
    return;
  }

  if (payload.status === "cancelled") {
    await sendCancelledEmail(order[0].customerEmail, order[0])
    return;
  }

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

  const paymentSession = await stripe.checkout.sessions.retrieve(sessionId);
  //payment_status = "no_payment_required", "paid", "unpaid"
  if (paymentSession.payment_status !== "paid") {
    throw new ApiError(403, "Payment Failled");
  }

  const metadata = paymentSession?.metadata;
  if (!metadata) {
    throw new ApiError(400, "Invalid Session Id")
  }

  //check already payment is completed
  const order = await OrderModel.findOne({
    _id: metadata.orderId,
    email: metadata.email,
    paymentStatus: "paid"
  });

  if (order) {
    throw new ApiError(400, "Payment already completed");
  }  

  //parse cartProducts
  const cartProducts = JSON.parse(metadata?.cartProducts);

   //transaction & rollback
  const session = await mongoose.startSession();

  try {
    //start transaction
    session.startTransaction();

    // update product sales in bulk
    //bulkWrite send one request to MongoDB:
    await ProductModel.bulkWrite(
      cartProducts.map((item: ICart) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: [
            {
              $set: {
                quantity: {
                  $max: [
                    { $subtract: ["$quantity", item.quantity] }, //quantity can't be negative, but 0
                    0
                  ]
                }
              }
            }
          ],
        }
      })),
      { session }
    );

    //update payment status
    const result = await OrderModel.updateOne({
      _id: metadata.orderId,
      email: metadata.email
    }, {
      paymentStatus: "paid"
    }, {
      session
    })

    //transaction success
    await session.commitTransaction();
    await session.endSession();
    return result;
  }catch (err:any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(err);
  }
};




export {
  createOrderService,
  getUserOrdersService,
  getAllOrdersService,
  getExportOrdersService,
  getSingleOrderService,
  updateOrderService,
  deleteOrderService,
  verifySessionService,
  createOrderWithCashService
};
