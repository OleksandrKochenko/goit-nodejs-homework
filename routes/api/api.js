const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const path = require("path");
const avatarsDir = path.resolve("public", "avatars");

const Contacts = require("../../models/contact");
const User = require("../../models/user");
const { HttpError, jimpUpload, sendEmail } = require("../../helpers");
const { SECRET_KEY, BASE_URL } = process.env;

const fetchListContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, ...query } = req.query;
    const skip = (page - 1) * limit;
    const allContacts = await Contacts.find(
      { owner, ...query },
      "-createdAt -updatedAt",
      { skip, limit }
    ).populate("owner", "_id name email");
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
};

const fetchContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const oneContact = await Contacts.findById(contactId);
    if (!oneContact) {
      throw HttpError(404, "Not Found");
    }
    res.json(oneContact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const addedContact = await Contacts.create({ ...req.body, owner });
    res.status(201).json(addedContact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contacts.findByIdAndDelete(contactId);
    if (!deletedContact) {
      throw HttpError(404, "Not Found");
    }
    console.log("removed:", deletedContact);
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const changeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await Contacts.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      throw HttpError(404, "Not Found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await Contacts.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );
    if (!updatedContact) {
      throw HttpError(404, "Not Found");
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) throw HttpError(409, "Email already in use");

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = nanoid();

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</p>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const existingUser = await User.findOne({ verificationToken });

    if (!existingUser) throw HttpError(404, "User not found");

    await User.findByIdAndUpdate(existingUser._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) throw HttpError(404, "User not found");

    if (existingUser.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${existingUser.verificationToken}">Click to verify email</p>`,
    };

    await sendEmail(verifyEmail);

    res.json({
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) throw HttpError(401, "Email or password is wrong");

    if (!existingUser.verify) throw HttpError(401, "Email don't verified");

    const passwordCompare = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCompare) throw HttpError(401, "Email or password is wrong");

    const payload = {
      id: existingUser._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(existingUser._id, { token });

    res.json({
      token,
      user: {
        email: existingUser.email,
        subscription: existingUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  next(HttpError(204));
};

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });
  res.json({
    message: "subscription updated",
  });
};

const updateAvatar = async (req, res, next) => {
  const { _id, name: userName } = req.user;
  const { path: oldPath, originalname } = req.file;

  await jimpUpload(oldPath);

  const uniqPrefix =
    Date.now() + "_" + Math.round(Math.random() * 1e9) + "_" + userName;
  const newFileName = `${uniqPrefix}_${originalname}`;

  const newPath = path.join(avatarsDir, newFileName);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", newFileName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  fetchListContacts,
  fetchContact,
  addContact,
  deleteContact,
  changeContact,
  updateFavorite,
  signUp,
  verify,
  resendVerify,
  signIn,
  getCurrentUser,
  logout,
  updateSubscription,
  updateAvatar,
};
