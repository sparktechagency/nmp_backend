"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
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
});
const ContactModel = (0, mongoose_1.model)('Contact', contactSchema);
exports.default = ContactModel;
