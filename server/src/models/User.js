import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  postcode: String,
  mp: Object,
  topic: String,
  message: String,
});

export default mongoose.model("User", userSchema);
