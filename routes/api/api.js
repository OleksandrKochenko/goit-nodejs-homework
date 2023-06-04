const Contacts = require("../../models/contact");
const { HttpError } = require("../../helpers");

const fetchListContacts = async (req, res, next) => {
  try {
    const allContacts = await Contacts.find({});
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
    const addedContact = await Contacts.create(req.body);
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

module.exports = {
  fetchListContacts,
  fetchContact,
  addContact,
  deleteContact,
  changeContact,
  updateFavorite,
};
