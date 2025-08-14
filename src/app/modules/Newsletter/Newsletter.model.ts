import { Schema, model } from 'mongoose';
import { INewsletter } from './Newsletter.interface';
      
const newsletterSchema = new Schema<INewsletter>({
  email: {
    type: String,
    required: true,
    trim: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed'],
    default: 'subscribed',
  },
}, {
  timestamps: true,
  versionKey: false
})

const NewsletterModel = model<INewsletter>('Newsletter', newsletterSchema);
export default NewsletterModel;
