"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateTransactionId() {
    const digits = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    const letters = Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z
    ).join('');
    return `${letters}${digits}`;
}
exports.default = generateTransactionId;
