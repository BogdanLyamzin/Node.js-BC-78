import express from "express";
import cors from "cors";
import { errors } from "celebrate";
import "dotenv/config";

import connectDatabase from "./db/connectDatabase.js";

import logger from "./middlewares/logger.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

import contactRouter from "./routers/contactRouter.js";
import validationRouter from "./routers/validationRouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/contacts", contactRouter);
app.use("/validation", validationRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectDatabase();

const port = Number(process.env.PORT) || 3030;
app.listen(port, ()=> console.log(`Server running on ${port} port`));
