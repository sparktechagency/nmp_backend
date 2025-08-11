import { model, Schema } from "mongoose";
import hashedPassword from "../../utils/hashedPassword";
import { IUser } from "./user.interface";


const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: [true, 'fullName is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["user", "admin", "super_admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ['blocked', 'unblocked'],
        default: 'unblocked'
    },
    otp: {
        type: String,
        required: [true, "otp is required"],
        trim: true,
        maxlength: 6,
        minlength: 6
    },
    otpExpires: {
        type: Date,
        default: () => new Date(+new Date() + 600000), // 10 minutes // OTP Code Will be expired within 10 minutes
    },
    resetOtp: {
        type: String,
        trim: true,
        maxlength: 6,
        minlength: 6
    },
    resetOtpstatus: {
      type: Number
    },
    resetOtpExpires: {
        type: Date,
    },
}, {
    timestamps: true,
    versionKey: false
})




//Hash Password before saving
userSchema.pre("save", async function (next) {
    const user = this; //this means user

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    user.password = await hashedPassword(user.password);
    next();
});



const UserModel = model<IUser>('User', userSchema);
export default UserModel;

