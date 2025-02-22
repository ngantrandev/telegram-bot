// models/User.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  id: { type: Number, required: true },
  is_bot: { type: Boolean, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String },
  username: { type: String },
  language_code: { type: String },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
