import { Router } from "express";

import { getAllValidations, getValidationByName } from "../controllers/validationControllers.js";

const validationRouter = Router();

validationRouter.get("/", getAllValidations);

validationRouter.get("/:name", getValidationByName);

export default validationRouter;
