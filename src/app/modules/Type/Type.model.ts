import { model, Schema } from "mongoose";
import { IType } from "./Type.interface";


const categorySchema = new Schema<IType>({
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



const TypeModel = model<IType>("Type", categorySchema);
export default TypeModel;