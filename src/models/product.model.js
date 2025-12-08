import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    index: true,
  },
  marca:{
    type: String,
    required: true,
  } ,
 precio: {
  type: Number,
  min: 0,
  default: 0,
},
stock: {
  type: Number,
  min: 0,
  default: 0,
},

  category: {
  type: String,
  enum: ["Ferreteria", "Electricidad", "Pintura", "Construccion"],
  default: "Ferreteria"
}

});
const productModel = model("products", productSchema);
export default productModel;