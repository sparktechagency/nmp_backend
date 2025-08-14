"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Policy_constant_1 = require("./Policy.constant");
const policySchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Policy_constant_1.PolicyTypeArray,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});
const PolicyModel = (0, mongoose_1.model)('Policy', policySchema);
exports.default = PolicyModel;
