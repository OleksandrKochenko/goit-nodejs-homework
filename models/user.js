const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../middlewares");
const enumSubscriptions = require("../constants/constants");

const userSchema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    subscription: {
      type: String,
      enum: enumSubscriptions,
      default: "starter",
    },
    avatarURL: {
      type: String,
    },
    token: { type: String },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = User;
