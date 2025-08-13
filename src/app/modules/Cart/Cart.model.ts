import { Schema, model } from 'mongoose';
import { ICart } from './Cart.interface';
      
const cartSchema = new Schema<ICart>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
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
  image: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false
})

const CartModel = model<ICart>('Cart', cartSchema);
export default CartModel;
      