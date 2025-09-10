import { Schema, model } from 'mongoose';
import { IShippingCost } from './ShippingCost.interface';

const shippingcostSchema = new Schema<IShippingCost>({
  name: {
    type: String, required: true
  }, // e.g., "Standard Shipping", "Free Above 100"
  minSubTotal: {
    type: Number,
    default: 0
  }, // rule applies if subtotal >= this
  maxSubTotal: {
    type: Number,
    default: Infinity
  }, // rule applies if subtotal <= this
  cost: {
    type: Number,
    required: true
  }, // flat cost for this range
  isActive: {
    type: Boolean,
    default: true
  }, // admin can toggle
  priority: {
    type: Number,
    default: 1,
    unique: true,
    trim: true
  }, // lower = higher priority
}, {
  timestamps: true,
  versionKey: false
})

const ShippingCostModel = model<IShippingCost>('ShippingCost', shippingcostSchema);
export default ShippingCostModel;
