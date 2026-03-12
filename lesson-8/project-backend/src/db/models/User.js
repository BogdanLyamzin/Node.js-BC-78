import { Schema, model } from "mongoose";

import { handleSaveError, setUpdateRules } from "../hooks.js";

import { emailRegexp } from "../../constants/contactContants.js";

const userSchema = new Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    match: emailRegexp,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {versionKey: false, timestamps: true});

userSchema.pre("save", function(){
  if(!this.username) {
    this.username = this.email;
  }
});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateRules);

userSchema.post("findOneAndUpdate", handleSaveError);

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = model("user", userSchema);

export default User;
