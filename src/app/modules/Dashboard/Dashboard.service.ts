import ApiError from "../../errors/ApiError";
import isValidYearFormat from "../../utils/isValidateYearFormat";
import OrderModel from "../Order/Order.model";
import ProductModel from "../Product/Product.model";
import UserModel from "../User/user.model";



const getStatsService = async () => {
  const totalUsers = await UserModel.countDocuments({
    role: "user"
  })

  const completedOrders = await OrderModel.countDocuments({
    status: "delivered",
    paymentStatus: "paid"
  })

  const totalIncomeResult = await OrderModel.aggregate([
    {
      $match: {
        status: "delivered",
        paymentStatus: "paid"
      }
    },
    {
      $group: {
        _id: 0,
        total: { $sum: "$totalPrice" },
      }
    }
  ])

  const totalProducts = await ProductModel.countDocuments();

  return {
    totalUsers,
    completedOrders,
    totalIncome: totalIncomeResult?.length > 0 ? totalIncomeResult[0]?.total : 0,
    totalProducts
  }
}



const getUserOverviewService = async (year: string) => {
  if(!isValidYearFormat(year)){
    throw new ApiError(400, "Invalid year, year should be in 'YYYY' format.")
  }

  const start = `${year}-01-01T00:00:00.000+00:00`;
  const end = `${year}-12-31T00:00:00.000+00:00`;

  const result = await UserModel.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(start), $lte: new Date(end) },
        role: "user"
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        users: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              "",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            "$_id.month",
          ],
        },
      },
    },
    {
      $project: {
        _id:0
      }
    }
  ])

  //Fill in missing months
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const filledData = allMonths.map((month) => {
    const found = result?.find((item) => item.month === month);
    return {
      month,
      users: found ? found.users : 0
    };
  });
 
  return filledData;
}


const getIncomeOverviewService = async (year: string) => {
  if(!isValidYearFormat(year)){
    throw new ApiError(400, "Invalid year, year should be in 'YYYY' format.")
  }

  const start = `${year}-01-01T00:00:00.000+00:00`;
  const end = `${year}-12-31T00:00:00.000+00:00`;

  const result = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(start), $lte: new Date(end) },
        paymentStatus: "paid"
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        income: { $sum: "$totalPrice" },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              "",
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            "$_id.month",
          ],
        },
      },
    },
    {
      $project: {
        _id:0
      }
    }
  ])

  // Fill in missing months
  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const filledData = allMonths.map((month) => {
    const found = result?.find((item) => item.month === month);
    return {
      month,
      income: found ? found.income : 0
    };
  });
 
  return filledData;
}


export {
  getStatsService,
  getUserOverviewService,
  getIncomeOverviewService
}