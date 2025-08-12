import { model, Schema } from "mongoose";
import { IFlavor } from "./Flavor.interface";


const flavorSchema = new Schema<IFlavor>({
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



const FlavorModel = model<IFlavor>("Flavor", flavorSchema);
export default FlavorModel;