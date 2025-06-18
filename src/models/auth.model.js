import mongoose, {Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";


// creating schema.
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: [true, "Username already taken"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    age: {
        type: Number,
    },
    profilePic: {
      type: String,
      default: "https://avatar.iran.liara.run/public/6",
    },
    freinds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verificationToken: {
      type: String,
      default: null,
    },
    forgetPasswordExpiry: {
      type: Date,
    },
    forgetPasswordToken: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// hashing the password (using bcrypt) if created new or updated before saving in db.
// so that we dont store RAW password in our db.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// method to compare stored password (the one in db) with the provided one.
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};



// creating model based on the above schema.
export const User = mongoose.model("User", userSchema);
