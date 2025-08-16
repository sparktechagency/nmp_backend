"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.refreshTokenService = exports.deleteMyAccountService = exports.changeStatusService = exports.changePasswordService = exports.forgotPassCreateNewPassService = exports.forgotPassVerifyOtpService = exports.forgotPassSendOtpService = exports.loginAdminService = exports.loginUserService = exports.resendVerifyEmailService = exports.verifyEmailService = exports.registerUserService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const checkPassword_1 = __importDefault(require("../../utils/checkPassword"));
const user_model_1 = __importDefault(require("../User/user.model"));
const createToken_1 = __importDefault(require("../../utils/createToken"));
const config_1 = __importDefault(require("../../config"));
const sendEmailUtility_1 = __importDefault(require("../../utils/sendEmailUtility"));
const hashedPassword_1 = __importDefault(require("../../utils/hashedPassword"));
const mongoose_1 = __importStar(require("mongoose"));
const verifyToken_1 = __importDefault(require("../../utils/verifyToken"));
const isJWTIssuedBeforePassChanged_1 = require("../../utils/isJWTIssuedBeforePassChanged");
const ApiError_2 = __importDefault(require("../../errors/ApiError"));
const sendVerificationEmail_1 = __importDefault(require("../../utils/sendVerificationEmail"));
const registerUserService = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName, password } = reqBody;
    //check email
    const existingUser = yield user_model_1.default.findOne({ email });
    //User already exists and verified
    if (existingUser && existingUser.isVerified) {
        throw new ApiError_2.default(409, "Email is already existed");
    }
    //User exists but not verified → resend verification
    if (existingUser && !existingUser.isVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        //update existingUser
        yield user_model_1.default.updateOne({ email }, { otp, otpExpires: new Date(+new Date() + 600000) });
        //send verification email
        yield (0, sendVerificationEmail_1.default)(email, fullName, otp.toString());
        return {
            message: "Verification email resent. Please check your inbox."
        };
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    //create new user
    yield user_model_1.default.create({
        fullName,
        email,
        password,
        otp
    });
    //send verification email
    yield (0, sendVerificationEmail_1.default)(email, fullName, otp.toString());
    return {
        message: "Please check your email to verify"
    };
});
exports.registerUserService = registerUserService;
const verifyEmailService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = payload;
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new ApiError_2.default(404, "Couldn't find this email address");
    }
    //user is alreay verified
    if (user === null || user === void 0 ? void 0 : user.isVerified) {
        throw new ApiError_2.default(409, "This Email is already verified");
    }
    if (user.otp !== otp) {
        throw new ApiError_2.default(400, "Invalid Otp Code");
    }
    const otpExpired = yield user_model_1.default.findOne({
        email,
        otp,
        otpExpires: { $gt: new Date(Date.now()) },
    });
    if (!otpExpired) {
        throw new ApiError_1.default(400, "Expired Otp Code");
    }
    //update the user 
    yield user_model_1.default.updateOne({ email: user === null || user === void 0 ? void 0 : user.email }, { isVerified: true, otp: "000000" });
    return null;
});
exports.verifyEmailService = verifyEmailService;
const resendVerifyEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(404, `Couldn't find this email address`);
    }
    //check if user is already verified
    if (user === null || user === void 0 ? void 0 : user.isVerified) {
        throw new ApiError_2.default(409, "This Email address is already verified");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    //update existingUser
    yield user_model_1.default.updateOne({ email }, { otp, otpExpires: new Date(+new Date() + 600000) });
    //send verification email
    yield (0, sendVerificationEmail_1.default)(email, user.fullName, otp.toString());
    return null;
});
exports.resendVerifyEmailService = resendVerifyEmailService;
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email }).select("+password");
    if (!user) {
        throw new ApiError_1.default(404, `Couldn't find this email address`);
    }
    //check email is not verified
    if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
        throw new ApiError_2.default(403, "Please verify your email");
    }
    //check user is blocked
    if (user.status === "blocked") {
        throw new ApiError_1.default(403, "Your account is blocked !");
    }
    //check password
    const isPasswordMatch = yield (0, checkPassword_1.default)(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(400, "Wrong Password");
    }
    //check you are not user
    if (user.role !== "user") {
        throw new ApiError_1.default(403, `Sorry! You have no access to login`);
    }
    //create accessToken
    const accessToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //create refreshToken
    const refreshToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
exports.loginUserService = loginUserService;
const loginAdminService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new ApiError_1.default(404, `Couldn't find this email address`);
    }
    //check email is not verified
    if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
        throw new ApiError_2.default(403, "Please verify your email");
    }
    //check user is blocked
    if (user.status === "blocked") {
        throw new ApiError_1.default(403, "Your account is blocked !");
    }
    //check you are not super_admin or administrator
    if ((user.role !== "admin") && (user.role !== "super_admin")) {
        throw new ApiError_1.default(403, `Sorry! You are not 'Super Admin' or 'Admin'`);
    }
    //check password
    const isPasswordMatch = yield (0, checkPassword_1.default)(payload.password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(400, 'Wrong Password');
    }
    //create accessToken
    const accessToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    //create refreshToken
    const refreshToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        message: `${user.role} login success`
    };
});
exports.loginAdminService = loginAdminService;
//forgot password-send-otp
// step-01
const forgotPassSendOtpService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(404, `Couldn't find this email address`);
    }
    //check email is not verified
    if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
        throw new ApiError_2.default(403, "Your account is not verified");
    }
    //check user is blocked
    if (user.status === "blocked") {
        throw new ApiError_1.default(403, "Your account is blocked !");
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    //update the reset otp
    yield user_model_1.default.updateOne({ email }, { resetOtp: otp, resetOtpstatus: 0, resetOtpExpires: new Date(+new Date() + 600000) });
    //send otp to the email address
    yield (0, sendEmailUtility_1.default)(email, user === null || user === void 0 ? void 0 : user.fullName, String(otp));
    return null;
});
exports.forgotPassSendOtpService = forgotPassSendOtpService;
//step-02
const forgotPassVerifyOtpService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = payload;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(404, `Couldn't find this email address`);
    }
    //check otp doesn't exist
    const otpExist = yield user_model_1.default.findOne({ email, resetOtp: otp, resetOtpstatus: 0 });
    if (!otpExist) {
        throw new ApiError_1.default(400, "Invalid Otp Code");
    }
    //check otp is expired
    const otpExpired = yield user_model_1.default.findOne({
        email,
        resetOtp: otp,
        resetOtpstatus: 0,
        resetOtpExpires: { $gt: new Date(Date.now()) },
    });
    if (!otpExpired) {
        throw new ApiError_1.default(400, "Expired Otp Code");
    }
    //update the otp status
    yield user_model_1.default.updateOne({ email, resetOtp: otp, resetOtpstatus: 0 }, { resetOtpstatus: 1 });
    return null;
});
exports.forgotPassVerifyOtpService = forgotPassVerifyOtpService;
//step-03
const forgotPassCreateNewPassService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, password } = payload;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new ApiError_1.default(404, `Couldn't find this email address`);
    }
    //check otp exist
    const otpExist = yield user_model_1.default.findOne({ email, resetOtp: otp, resetOtpstatus: 1 });
    if (!otpExist) {
        throw new ApiError_1.default(400, "Invalid Otp Code");
    }
    //Database Third Process
    //check otp is expired
    const OtpExpired = yield user_model_1.default.findOne({
        email,
        resetOtp: otp,
        resetOtpstatus: 1,
        resetOtpExpires: { $gt: new Date(Date.now()) },
    });
    if (!OtpExpired) {
        throw new ApiError_1.default(400, `Expired Otp Code`);
    }
    //update the password
    const hashPass = yield (0, hashedPassword_1.default)(password); //hashedPassword
    const result = yield user_model_1.default.updateOne({ email: email }, { password: hashPass, passwordChangedAt: new Date(), resetOtp: '000000' });
    return result;
});
exports.forgotPassCreateNewPassService = forgotPassCreateNewPassService;
const changePasswordService = (loginUserId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = payload;
    const ObjectId = mongoose_1.Types.ObjectId;
    const user = yield user_model_1.default.findById(loginUserId).select('+password');
    //checking if the password is not correct
    const isPasswordMatched = yield (0, checkPassword_1.default)(currentPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(400, 'Wrong Current Password');
    }
    //hash the newPassword
    const hashPass = yield (0, hashedPassword_1.default)(newPassword);
    //update the password
    const result = yield user_model_1.default.updateOne({ _id: new ObjectId(loginUserId) }, { password: hashPass, passwordChangedAt: new Date() });
    return result;
});
exports.changePasswordService = changePasswordService;
const changeStatusService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new ApiError_1.default(404, "User Not Found");
    }
    const result = yield user_model_1.default.updateOne({ _id: new ObjectId(id) }, payload);
    return result;
});
exports.changeStatusService = changeStatusService;
const deleteMyAccountService = (loginUserId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.Types.ObjectId;
    const user = yield user_model_1.default.findById(loginUserId).select('+password');
    if (!user) {
        throw new ApiError_1.default(404, "User Not Found");
    }
    //check password
    const isPasswordMatch = yield (0, checkPassword_1.default)(password, user.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(400, 'Password is not correct');
    }
    //transaction & rollback
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //delete user
        const result = yield user_model_1.default.deleteOne({ _id: new ObjectId(loginUserId) }, { session });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.deleteMyAccountService = deleteMyAccountService;
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new ApiError_1.default(401, `You are not unauthorized !`);
    }
    try {
        //token-verify
        const decoded = (0, verifyToken_1.default)(token, config_1.default.jwt_refresh_secret);
        //check if the user is exist
        const user = yield user_model_1.default.findById(decoded.id);
        if (!user) {
            throw new ApiError_1.default(401, `You are unauthorized, user not found`);
        }
        //check if the user is already blocked
        const blockStatus = user.status;
        if (blockStatus === "blocked") {
            throw new ApiError_1.default(401, `You are unauthorized, This user is blocked`);
        }
        //check if passwordChangedAt is greater than token iat
        if ((user === null || user === void 0 ? void 0 : user.passwordChangedAt) &&
            (0, isJWTIssuedBeforePassChanged_1.isJWTIssuedBeforePassChanged)(user === null || user === void 0 ? void 0 : user.passwordChangedAt, decoded.iat)) {
            throw new ApiError_1.default(401, "You are not authorized !");
        }
        //create accessToken
        const accessToken = (0, createToken_1.default)({ email: user.email, id: String(user._id), role: user.role }, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
        return {
            accessToken,
        };
    }
    catch (err) {
        throw new ApiError_1.default(401, "You are unauthorized");
    }
});
exports.refreshTokenService = refreshTokenService;
