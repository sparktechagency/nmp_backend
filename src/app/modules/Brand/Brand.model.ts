import { model, Schema } from "mongoose";
import { IBrand } from "./Brand.interface";


const brandSchema = new Schema<IBrand>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false
})



const BrandModel = model<IBrand>("Brand", brandSchema);
export default BrandModel;