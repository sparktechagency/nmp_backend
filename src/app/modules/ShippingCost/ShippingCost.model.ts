import { Schema, model } from 'mongoose';
import { IShippingCost } from './ShippingCost.interface';
      
const shippingcostSchema = new Schema<IShippingCost>({
  name: { 
    type: String,
    required: true
  },
  description: { 
    type: String
  }
}, {
    timestamps: true,
    versionKey: false
})
      
const ShippingCostModel = model<IShippingCost>('ShippingCost', shippingcostSchema);
export default ShippingCostModel;
      