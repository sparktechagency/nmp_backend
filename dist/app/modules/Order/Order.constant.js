"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidFields = exports.UserOrderValidFields = exports.OrderSearchableFields = void 0;
exports.OrderSearchableFields = ['fullName', 'email', 'phone', 'token'];
exports.UserOrderValidFields = [
    "page",
    "limit",
    "status"
];
exports.OrderValidFields = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
    "paymentStatus"
];
