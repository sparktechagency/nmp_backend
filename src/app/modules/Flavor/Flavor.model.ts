import { model, Schema } from "mongoose";
import { IFlavor } from "./Flavor.interface";


const flavorSchema = new Schema<IFlavor>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    typeId: {
        type: Schema.Types.ObjectId,
        required: [true, "typeId is required"],
        ref: "Type"
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



const FlavorModel = model<IFlavor>("Flavor", flavorSchema);
export default FlavorModel;