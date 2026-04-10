import mongoose, { Schema } from 'mongoose';

import jwt from 'jsonwebtoken';


const userSchema = new Schema(
  {
 email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      
    }
}, {timestamps : true})


export default mongoose.model('User', userSchema);