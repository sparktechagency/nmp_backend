"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasDuplicates(arr) {
    return new Set(arr).size !== arr.length;
}
exports.default = hasDuplicates;
