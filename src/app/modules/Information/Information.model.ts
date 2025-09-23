import { Schema, model } from 'mongoose';
import { IInformation } from './Information.interface';

const informationSchema = new Schema<IInformation>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subTitle: {
    type: String,
    required: true,
    trim: true
  },
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
  facebook: {
    type: String,
    required: true,
    trim: true
  },
  heroImg: {
    type: String,
    trim: true,
    default: ""
  },
  age: {
    type: Number,
    required: true,
    default:0
  },
  countDownDate: {
    type: Date,
  },
  countDownImg: {
    type: String,
    trim: true,
    default: ""
  },
}, {
  timestamps: false,
  versionKey: false
})

const InformationModel = model<IInformation>('Information', informationSchema);
export default InformationModel;
