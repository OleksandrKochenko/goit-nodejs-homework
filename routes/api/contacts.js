const express = require("express");
const router = express.Router();

const {
  isValidId,
  validateData,
  validatePatchData,
} = require("../../middlewares");
const {
  fetchListContacts,
  fetchContact,
  addContact,
  deleteContact,
  changeContact,
  updateFavorite,
} = require("./api");
const authentificate = require("../../middlewares/authentificate");

router.use(authentificate);

router.get("/", fetchListContacts);

router.get("/:contactId", isValidId, fetchContact);

router.post("/", validateData, addContact);

router.delete("/:contactId", isValidId, deleteContact);

router.put("/:contactId", isValidId, validateData, changeContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validatePatchData,
  updateFavorite
);

module.exports = router;
