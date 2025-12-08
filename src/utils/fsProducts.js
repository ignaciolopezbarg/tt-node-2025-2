
import fs from "fs";
import path from "path";

const FILE_PATH = path.resolve("src/data/products.json");

export const leerProductosFS = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
};

export const guardarProductosFS = (productos) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(productos, null, 2));
};
