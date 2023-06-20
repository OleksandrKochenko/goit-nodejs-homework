const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../middlewares");

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
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: { type: String },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = User;
