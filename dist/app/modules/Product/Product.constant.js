"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestSellerValidFields = exports.ProductValidFields = exports.UserProductValidFields = exports.ProductSearchableFields = void 0;
exports.ProductSearchableFields = ['name', 'category', 'brand', 'flavor'];
exports.UserProductValidFields = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "categoryId",
    "brandId",
    "flavorId",
    "stockStatus",
    "ratings",
    "fromPrice",
    "toPrice"
];
exports.ProductValidFields = [
    "searchTerm",
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
    "stockStatus"
];
exports.BestSellerValidFields = [
    "page",
    "limit"
];
