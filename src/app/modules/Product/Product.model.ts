import { Schema, model } from 'mongoose';
import { IProduct } from './Product.interface';

const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  typeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Type"
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Category"
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: "Brand"
  },
  flavorId: {
    type: Schema.Types.ObjectId,
    ref: "Flavor"
  },
  currentPrice: {
    type: Number,
    required: true,
    trim: true
  },
  originalPrice: {
    type: Number,
    default: 0,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    trim: true
  },
  discount: {
    type: String,
    default: ""
  },
  ratings: {
    type: Number,
    trim: true,
    default: 0,
    max: 5
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  total_sold: {
    type: Number,
    default: 0
  }, 
  isFeatured: {
    type: Boolean,
    default: false
  }, 
  status: {
    type: String,
    enum: ['visible', 'hidden'],
    default: "visible"
  },
}, {
  timestamps: true,
  versionKey: false
})

const ProductModel = model<IProduct>('Product', productSchema);
export default ProductModel;
