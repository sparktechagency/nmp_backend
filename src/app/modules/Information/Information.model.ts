import { Schema, model } from 'mongoose';
import { IInformation } from './Information.interface';
      
const informationSchema = new Schema<IInformation>({
  email: { 
    type: String,
    required: true,
    trim: true
  },
  phone: { 
    type: String,
    required: true,
    trim: true
  },
  address: { 
    type: String,
    required: true,
    trim: true
  },
  instagram: { 
    type: String,
    required: true,
    trim: true
  },
  telegram: { 
    type: String,
    required: true,
    trim: true
  }
}, {
    timestamps: false,
    versionKey: false
})
      
const InformationModel = model<IInformation>('Information', informationSchema);
export default InformationModel;
      