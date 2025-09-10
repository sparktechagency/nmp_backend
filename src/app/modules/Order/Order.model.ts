import { Schema, model } from 'mongoose';
import { IOrder, IOrderItem, IShipping } from './Order.interface';

const orderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    min: 1
  },
  quantity: {
    type: Number,
    required: true,
    trim: true,
    min: 1
  },
  total: {
    type: Number,
    required: true,
    trim: true,
    min: 1
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  colorId: {
    type: Schema.Types.ObjectId,
    ref: "Color"
  },
  size: {
    type: String
  },
}, {
  _id:false,
  timestamps: false,
  versionKey: false
})

const shippingSchema = new Schema<IShipping>({
  streetAddress: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, "zipCode is required"],
    trim: true,
    minlength: 5
  }
}, { _id: false });

      
const orderSchema = new Schema<IOrder>({
  token: {
    type: String,
    unique: true,
    required: true,
    minlength: [6, "Token must be 6 characters long"],
    maxlength: [6, "Token must be 6 characters long"]
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  products: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function (value: IOrderItem[]) {
        return value.length > 0;
      },
      message: "At least one product is required in the order."
    }
  },
  subTotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "unpaid", "failled", "refund"],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  deliveryAt: {
    type: Date,
  },
  shipping: {
    type: shippingSchema,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
})
      
const OrderModel = model<IOrder>('Order', orderSchema);
export default OrderModel;
      