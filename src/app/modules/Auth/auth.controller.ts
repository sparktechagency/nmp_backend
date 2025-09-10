import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { changePasswordService, changeStatusService, deleteMyAccountService, forgotPassCreateNewPassService, forgotPassSendOtpService, forgotPassVerifyOtpService,  loginAdminService, loginUserService, refreshTokenService, registerUserService, resendVerifyEmailService, verifyEmailService } from "./auth.service";


const registerUser = catchAsync(async (req, res) => {
  const result = await registerUserService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null
  })
});


const verifyEmail = catchAsync(async (req, res) => {
  const result = await verifyEmailService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email is verified successfully",
    data: result
  })
});


const resendVerifyEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await resendVerifyEmailService(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Verification email resent. Please check your inbox.",
    data: result
  })
});


const loginUser = catchAsync(async (req, res) => {
  const result = await loginUserService(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,  // Prevents client-side access to the cookie (more secure)
    secure: config.node_env === "production", // Only use HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
    sameSite: "strict", // Prevents CSRF attacks
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login Success",
    data: {
      accessToken
    }
  })
});



const loginAdmin = catchAsync(async (req, res) => {
  const result = await loginAdminService(req.body);
  const { accessToken, refreshToken, message} = result;
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,  // Prevents client-side access to the cookie (more secure)
    secure: config.node_env === "production", // Only use HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 day
    sameSite: "strict", // Prevents CSRF attacks
  });
 
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: message,
    data: {
      accessToken
    }
  })
 })

//forgot-password
//step-01
const forgotPassSendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await forgotPassSendOtpService(email);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Otp is sent to your email address successfully",
    data: result
  })
});


//step-02
const forgotPassVerifyOtp = catchAsync(async (req, res) => {
    const result = await forgotPassVerifyOtpService(req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Otp is verified successfully",
      data: result
    })
 });


 //step-03
const forgotPassCreateNewPass = catchAsync(async (req, res) => {
  const result = await forgotPassCreateNewPassService(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password is reset successfully",
    data: result
  })
});



const changePassword = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const result = await changePasswordService(loginUserId as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password is updated successfully",
    data: result
  })
});



const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await changeStatusService(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User status is changed successfully",
    data: result
  })
});



const deleteMyAccount = catchAsync(async (req, res) => {
  const loginUserId = req.headers.id;
  const { password } = req.body
  const result = await deleteMyAccountService(loginUserId as string, password);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My account is deleted successfully",
    data: result
  })
});



const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  
  const result = await refreshTokenService(refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token is retrieved successfully !',
    data: result
  });
});

 

 const AuthController = {
  registerUser,
  verifyEmail,
  resendVerifyEmail,
  loginUser,
  loginAdmin,
  forgotPassSendOtp,
  forgotPassVerifyOtp,
  forgotPassCreateNewPass,
  changePassword,
  changeStatus,
  deleteMyAccount,
  refreshToken
}

export default AuthController;
 