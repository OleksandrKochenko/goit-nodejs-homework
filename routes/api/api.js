const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Contacts = require("../../models/contact");
const User = require("../../models/user");
const { HttpError } = require("../../helpers");
const { SECRET_KEY } = process.env;

const fetchListContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const allContacts = await Contacts.find(
      { owner },
      "-createdAt -updatedAt"
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

    const newUser = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
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

    const passwordCompare = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCompare) throw HttpError(401, "Email or password is wrong");

    const payload = {
      id: existingUser._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

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

module.exports = {
  fetchListContacts,
  fetchContact,
  addContact,
  deleteContact,
  changeContact,
  updateFavorite,
  signUp,
  signIn,
};
