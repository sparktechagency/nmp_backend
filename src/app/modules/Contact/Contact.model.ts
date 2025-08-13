import { Schema, model } from 'mongoose';
import { IContact } from './Contact.interface';
      
const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'name is required'],
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
  message: { 
    type: String,
    required: true,
    trim: true
  },
  replyText: { 
    type: String,
    default: ""
  },
  replyAt: {
    type: Date,
  },
}, {
    timestamps: true,
    versionKey: false
})
      
const ContactModel = model<IContact>('Contact', contactSchema);
export default ContactModel;
      