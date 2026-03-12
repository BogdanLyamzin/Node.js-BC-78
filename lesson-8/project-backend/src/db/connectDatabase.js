import mongoose from "mongoose";
// import Contact from "./models/Contact.js";

const {DB_HOST} = process.env;

const connectDatabase = async()=> {
  try {
    await mongoose.connect(DB_HOST);
    // await Contact.syncIndexes();
    console.log("Successfully connect database");
  }
  catch(error) {
    console.log("Failed connect database", error);
    throw error;
  }
}

export default connectDatabase;
