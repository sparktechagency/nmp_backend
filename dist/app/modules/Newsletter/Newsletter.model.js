"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const newsletterSchema = new mongoose_1.Schema({
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
});
const NewsletterModel = (0, mongoose_1.model)('Newsletter', newsletterSchema);
exports.default = NewsletterModel;
