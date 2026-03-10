import {Router} from "express";
import { celebrate } from "celebrate";

import { getContacts, getContactById, addContact, updateContactById, deleteContactById } from "../controllers/contactControllers.js";

import { createContactSchema, contactIdSchema, updateContactSchema } from "../validations/contactsValidation.js";

const contactRouter = Router();

contactRouter.get("/", getContacts);

contactRouter.get("/:id", celebrate(contactIdSchema), getContactById);

contactRouter.post("/", celebrate(createContactSchema), addContact);

contactRouter.patch("/:id", celebrate(updateContactSchema), updateContactById);

contactRouter.delete("/:id", celebrate(contactIdSchema), deleteContactById);

export default contactRouter;
