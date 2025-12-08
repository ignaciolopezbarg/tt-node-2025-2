import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    edad: {
      type: Number,
      min: 0,
      default: 0,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  
);

const UserModel = model("users", userSchema);
export default UserModel;
