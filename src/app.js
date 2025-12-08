import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const modo = process.argv[2] || "fs";
const modosValidos = ["fs", "mongo"];

if (!modosValidos.includes(modo)) {
  console.error(` Modo inválido. Debes usar: fs o mongo.`);
  console.error(`Ejemplo: npm run dev fs   |   npm run dev mongo`);
  process.exit(1);
}

app.locals.modo = modo;
console.log(` Modo de ejecución: ${modo}`);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    if (modo === "mongo") {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        console.error(" Falta la variable MONGODB_URI en .env");
        process.exit(1);
      }

      await mongoose.connect(uri);
      console.log("✅ Conectado a MongoDB Atlas");
    }

    app.use("/api/products", productsRoutes);
    app.use("/api/users", usersRoutes);

    // Ruta raíz
    app.get("/", (req, res) => {
      res.send("Hola desde la entrega final!");
    });

    // 404
    app.use((req, res) => {
      res.status(404).json({ error: "Ruta no encontrada" });
    });

    // Handler global de errores
    app.use((err, req, res, next) => {
      console.error("🔥 Error:", err);
      res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
      });
    });

    app.listen(PORT, () => {
      console.log(
        `🌐 Server running on port ${PORT} (${modo.toUpperCase()} mode)`
      );
    });
  } catch (err) {
    console.error(" Error iniciando servidor:", err.message);
    process.exit(1);
  }
};

startServer();
