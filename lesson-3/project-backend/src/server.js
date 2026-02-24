import express from "express";
import cors from "cors";
import pino from "pino-http";
import "dotenv/config";

import connectDatabase from "./db/connectDatabase.js";

import Contact from "./db/models/Contact.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get("/contacts", async (req, res)=> {
  const contacts = await Contact.find();
  res.json(contacts);
})

app.get("/contacts/:id", async (req, res)=> {
  const {id} = req.params;
  const contact = await Contact.findById(id);
  res.json(contact);
})

app.post("/contacts", async(req, res)=> {
  const newContact = await Contact.create(req.body);
  res.status(201).json(newContact);
})

app.use((req, res)=> {
  res.status(404).json({
    message: `${req.method} ${req.url} not found`
  })
})

app.use((error, req, res, next)=> {
  res.status(500).json({
    message: error.message
  })
})

await connectDatabase();

const port = Number(process.env.PORT) || 3030;
app.listen(port, ()=> console.log(`Server running on ${port} port`));
