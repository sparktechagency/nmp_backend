"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const config_1 = __importDefault(require("../config"));
const s3_1 = __importDefault(require("../helper/s3"));
const uploadImage = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // const path = `${req.protocol}://${req.get("host")}/uploads/${req?.file?.filename}`;  //for local machine
    // return path;
    try {
        if (!req.file) {
            throw new ApiError_1.default(400, "Please upload a file");
        }
        const params = {
            Bucket: config_1.default.aws_s3_bucket_name,
            Key: `${Date.now()}-${req.file.originalname}`, // Unique key for the S3 object
            Body: req.file.buffer, // The file content as a Buffer
            ContentType: req.file.mimetype, // Set the correct content type
            //ACL: 'public-read', // Optional: Make the object publicly readable
        };
        const data = yield s3_1.default.upload(params).promise();
        return data === null || data === void 0 ? void 0 : data.Location;
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.default = uploadImage;
