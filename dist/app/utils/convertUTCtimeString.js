"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convertUTCtimeString = (isoString) => {
    const date = new Date(isoString);
    const timeStringUTC = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
    });
    return timeStringUTC;
    //console.log(timeStringUTC); // Output: "10:00 AM"
};
exports.default = convertUTCtimeString;
