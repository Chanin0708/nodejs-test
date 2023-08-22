const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  firstname: { type: String, default: null },
  lastname: { type: String, default: null },
  national_id: { type: String },
  national_id_mode: { type: Number },
  policy_id: { type: Number },
  usage_objective: { type: String, default: null },
  other_object: { type: String, default: null },
  create_at: { type: Date, default: Date.now },
  previlage_id: { type: Number, default: 3 },
  count_login: { type: Number, default: 0 },
  status_id: { type: Number, default: 1 },
  status_account: { type: String, default: "active" },
  last_update: { type: Date, default: Date.now },
  email_news: { type: Number, default: 1 },
  two_factor_authen: { type: String, default: "off" },
  type_user: { type: String, default: "Datax" },
  position: { type: String, default: null },
  organizationname: { type: String, default: null },
  phone: { type: String, default: null },
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);
