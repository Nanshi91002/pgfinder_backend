const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin", "owner"] },
  status: { type: String, default: "active", enum: ["active", "inactive", "deleted", "blocked"] },
});

module.exports = mongoose.model("users", userSchema);