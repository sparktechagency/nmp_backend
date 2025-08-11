"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidYearFormat(year) {
    const yearString = year.toString();
    return /^\d{4}$/.test(yearString) && Number(yearString) >= 1000 && Number(yearString) <= 9999; //true/false
}
exports.default = isValidYearFormat;
