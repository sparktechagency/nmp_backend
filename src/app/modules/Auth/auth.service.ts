import { Secret } from "jsonwebtoken";
import AppError from "../../errors/ApiError";
import checkPassword from "../../utils/checkPassword";
import UserModel from "../User/user.model";
import { IChangePass, ILoginUser, INewPassword, IVerifyOTp } from "./auth.interface";
import createToken, { TExpiresIn } from "../../utils/createToken";
import config from "../../config";
import sendEmailUtility from "../../utils/sendEmailUtility";
import hashedPassword from "../../utils/hashedPassword";
import mongoose, { Types } from "mongoose";
import verifyToken from "../../utils/verifyToken";
import { isJWTIssuedBeforePassChanged } from "../../utils/isJWTIssuedBeforePassChanged";
import { IUser } from "../User/user.interface";
import ApiError from "../../errors/ApiError";
import sendVerificationEmail from "../../utils/sendVerificationEmail";


const registerUserService = async (reqBody: IUser) => {
  const { email, fullName, password } = reqBody;
  //return reqBody

  //check email
  const existingUser = await UserModel.findOne({ email });

  //User already exists and verified
  if (existingUser && existingUser.isVerified) {
    throw new ApiError(409, "Email is already existed");
  }

  //User exists but not verified → resend verification
  if (existingUser && !existingUser.isVerified) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    //update existingUser
    await UserModel.updateOne({ email }, { otp, otpExpires: new Date(+new Date() + 600000)});
    //send verification email
    await sendVerificationEmail(email, fullName, otp.toString());

    return {
      message: "Verification email resent. Please check your inbox."
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  //create new user
  await UserModel.create({
    fullName,
    email,
    password,
    otp
  });

  //send verification email
  await sendVerificationEmail(email, fullName, otp.toString());

  return {
    message: "Please check your email to verify"
  }
}

const verifyEmailService = async (payload: IVerifyOTp) => {
  const { email, otp } = payload;

  const user = await UserModel.findOne({ email: payload.email });

  if (!user) {
    throw new ApiError(404, "Couldn't find this email address");
  }

  //user is alreay verified
  if (user?.isVerified) {
    throw new ApiError(409, "This Email is already verified");
  }

  if (user.otp !== otp) {
    throw new ApiError(400, "Invalid Otp Code");
  }

  const otpExpired = await UserModel.findOne({
    email,
    otp,
    otpExpires: { $gt: new Date(Date.now()) },
  });

  if (!otpExpired) {
    throw new AppError(400, "Expired Otp Code");
  }

  //update the user 
  await UserModel.updateOne({ email: user?.email }, { isVerified: true, otp:"000000" })
  
  //create accessToken
  const accessToken = createToken(
    { email: user.email, fullName: user?.fullName, id: String(user._id), role: user.role },
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as TExpiresIn
  );
  //create refreshToken
  const refreshToken = createToken(
    { email: user.email, fullName: user?.fullName, id: String(user._id), role: user.role },
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as TExpiresIn
  );

  return {
    accessToken,
    refreshToken
  }

}


const resendVerifyEmailService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

  //check if user is already verified
  if (user?.isVerified) {
    throw new ApiError(409, "This Email address is already verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  //update existingUser
  await UserModel.updateOne({ email }, { otp, otpExpires: new Date(+new Date() + 600000) });
  //send verification email
  await sendVerificationEmail(email, user.fullName, otp.toString());
  return null;
}

const loginUserService = async (payload: ILoginUser) => {
  const user = await UserModel.findOne({ email: payload.email }).select(
    "+password"
  );
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

 //check email is not verified
 if(!user?.isVerified){
  throw new ApiError(403, "Please verify your email");
 }

  //check user is blocked
  if (user.status === "blocked") {
    throw new AppError(403, "Your account is blocked !")
  }

  //check password
  const isPasswordMatch = await checkPassword(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(400, "Wrong Password");
  }

  //check you are not user
  if (user.role !== "user") {
    throw new AppError(403, `Sorry! You have no access to login`);
  }

  //create accessToken
  const accessToken = createToken(
    { email: user.email, fullName: user?.fullName, id: String(user._id), role: user.role },
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as TExpiresIn
  );
  //create refreshToken
  const refreshToken = createToken(
    { email: user.email, fullName: user?.fullName, id: String(user._id), role: user.role },
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires_in as TExpiresIn
  );

  return {
    accessToken,
    refreshToken,
  };
}


const loginAdminService = async (payload: ILoginUser) => {
  const user = await UserModel.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

  //check email is not verified
  if (!user?.isVerified) {
    throw new ApiError(403, "Please verify your email");
  }

  //check user is blocked
  if (user.status === "blocked") {
    throw new AppError(403, "Your account is blocked !")
  }

  //check you are not super_admin or administrator
  if ((user.role !== "admin") && (user.role !== "super_admin")) {
    throw new AppError(403, `Sorry! You are not 'Super Admin' or 'Admin'`);
  }

  //check password
  const isPasswordMatch = await checkPassword(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(400, 'Wrong Password');
  }


  //create accessToken
  const accessToken = createToken({ email: user.email, id: String(user._id), role: user.role }, config.jwt_access_secret as Secret, config.jwt_access_expires_in as TExpiresIn);
  //create refreshToken
  const refreshToken = createToken({ email: user.email, id: String(user._id), role: user.role }, config.jwt_refresh_secret as Secret, config.jwt_refresh_expires_in as TExpiresIn);

  return {
    accessToken,
    refreshToken,
    message: `${user.role} login success`
  }
}

//forgot password-send-otp
// step-01
const forgotPassSendOtpService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

  //check email is not verified
  if (!user?.isVerified) {
    throw new ApiError(403, "Your account is not verified");
  }

  //check user is blocked
  if (user.status === "blocked") {
    throw new AppError(403, "Your account is blocked !");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  //update the reset otp
  await UserModel.updateOne({ email }, { resetOtp: otp, resetOtpstatus:0, resetOtpExpires: new Date(+new Date() + 600000)})

  //send otp to the email address
  await sendEmailUtility(email, user?.fullName, String(otp));
  return null;
};



//step-02
const forgotPassVerifyOtpService = async (payload: IVerifyOTp) => {
  const { email, otp } = payload;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

  //check otp doesn't exist
  const otpExist = await UserModel.findOne({ email, resetOtp:otp, resetOtpstatus: 0 });
  if (!otpExist) {
    throw new AppError(400, "Invalid Otp Code");
  }

  //check otp is expired
  const otpExpired = await UserModel.findOne({
    email,
    resetOtp: otp,
    resetOtpstatus: 0,
    resetOtpExpires: { $gt: new Date(Date.now()) },
  });

  if (!otpExpired) {
    throw new AppError(400, "Expired Otp Code");
  }


  //update the otp status
  await UserModel.updateOne(
    { email, resetOtp:otp, resetOtpstatus: 0 },
    { resetOtpstatus: 1 }
  );

  return null;
};


//step-03
const forgotPassCreateNewPassService = async (payload: INewPassword) => {
  const { email, otp, password } = payload;
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError(404, `Couldn't find this email address`);
  }

  //check otp exist
  const otpExist = await UserModel.findOne({ email, resetOtp: otp, resetOtpstatus: 1 });
  if (!otpExist) {
    throw new AppError(400, "Invalid Otp Code");
  }



  //Database Third Process
  //check otp is expired
  const OtpExpired = await UserModel.findOne({
    email,
    resetOtp:otp,
    resetOtpstatus: 1,
    resetOtpExpires: { $gt: new Date(Date.now()) },
  });


  if (!OtpExpired) {
    throw new AppError(400, `Expired Otp Code`);
  }

  //update the password
  const hashPass = await hashedPassword(password);//hashedPassword
  const result = await UserModel.updateOne({ email: email }, { password: hashPass, passwordChangedAt: new Date(), resetOtp: '000000' })

  return result;
}


const changePasswordService = async (loginUserId: string, payload: IChangePass) => {
  const { currentPassword, newPassword } = payload;
  const ObjectId = Types.ObjectId;

  const user = await UserModel.findById(loginUserId).select('+password');

  //checking if the password is not correct
  const isPasswordMatched = await checkPassword(
    currentPassword,
    user?.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(400, 'Wrong Current Password');
  }

  //hash the newPassword
  const hashPass = await hashedPassword(newPassword);

  //update the password
  const result = await UserModel.updateOne(
    { _id: new ObjectId(loginUserId) },
    { password: hashPass, passwordChangedAt: new Date() }
  );

  return result;

}


const changeStatusService = async (id: string, payload: { status: string }) => {
  const ObjectId = Types.ObjectId;

  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(404, "User Not Found");
  }

  const result = await UserModel.updateOne(
    { _id: new ObjectId(id) },
    payload
  );

  return result;
}


const deleteMyAccountService = async (loginUserId: string, password: string) => {
  const ObjectId = Types.ObjectId;
  const user = await UserModel.findById(loginUserId).select('+password');
  if (!user) {
    throw new AppError(404, "User Not Found");
  }

  //check password
  const isPasswordMatch = await checkPassword(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(400, 'Password is not correct');
  }

  //transaction & rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //delete user
    const result = await UserModel.deleteOne({ _id: new ObjectId(loginUserId) }, { session })
    await session.commitTransaction();
    await session.endSession();
    return result;
  }
  catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err)
  }
}


const refreshTokenService = async (token: string) => {
  if (!token) {
    throw new AppError(401, `You are not unauthorized !`);
  }

  try {
    //token-verify
    const decoded = verifyToken(token, config.jwt_refresh_secret as Secret);

    //check if the user is exist
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new AppError(401, `You are unauthorized, user not found`);
    }

    //check if the user is already blocked
    const blockStatus = user.status;
    if (blockStatus === "blocked") {
      throw new AppError(401, `You are unauthorized, This user is blocked`);
    }

    //check if passwordChangedAt is greater than token iat
    if (
      user?.passwordChangedAt &&
      isJWTIssuedBeforePassChanged(
        user?.passwordChangedAt,
        decoded.iat as number
      )
    ) {
      throw new AppError(401, "You are not authorized !");
    }

    //create accessToken
    const accessToken = createToken(
      { email: user.email, id: String(user._id), role: user.role },
      config.jwt_access_secret as Secret,
      config.jwt_access_expires_in as TExpiresIn
    );

    return {
      accessToken,
    };
  } catch (err: any) {
    throw new AppError(401, "You are unauthorized");
  }
};




export {
  registerUserService,
  verifyEmailService,
  resendVerifyEmailService,
  loginUserService,
  loginAdminService,
  forgotPassSendOtpService,
  forgotPassVerifyOtpService,
  forgotPassCreateNewPassService,
  changePasswordService,
  changeStatusService,
  deleteMyAccountService,
  refreshTokenService,
}