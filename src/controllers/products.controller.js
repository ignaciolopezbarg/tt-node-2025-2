
import productModel from "../models/product.model.js";
import { leerProductosFS, guardarProductosFS } from "../utils/fsProducts.js";

export const obtenerProductos = async (req, res) => {
  const modo = req.app.locals.modo;

  try {
    if (modo === "fs") {
      return res.json(leerProductosFS());
    }

    if (modo === "mongo") {
      const productos = await productModel.find().lean();
      return res.json(productos);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  const { id } = req.params;
  const modo = req.app.locals.modo;

  try {
    if (modo === "fs") {
      const productos = leerProductosFS();
      const producto = productos.find((p) => p.id == id);
      if (!producto) return res.status(404).json({ error: "No encontrado" });
      return res.json(producto);
    }

    if (modo === "mongo") {
      const producto = await productModel.findById(id);
      if (!producto) return res.status(404).json({ error: "No encontrado" });
      return res.json(producto);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener producto" });
  }
};

export const crearProducto = async (req, res) => {
  const modo = req.app.locals.modo;
  const { nombre, marca, precio, stock, category } = req.body;

  try {
    if (modo === "fs") {
      const productos = leerProductosFS();

      const id = productos.length
        ? productos[productos.length - 1].id + 1
        : 1;

      const nuevo = { id, nombre, marca, precio, stock, category };
      productos.push(nuevo);
      guardarProductosFS(productos);

      return res.status(201).json(nuevo);
    }

    if (modo === "mongo") {
      const nuevo = await productModel.create({
        nombre,
        marca,
        precio,
        stock,
        category,
      });

      return res.status(201).json(nuevo);
    }
  } catch (error) {
  console.error("Error al crear producto:", error);
  res.status(500).json({ error: error.message });
}
};

export const actualizarProducto = async (req, res) => {
  const modo = req.app.locals.modo;
  const { id } = req.params;

  try {
    if (modo === "fs") {
      const productos = leerProductosFS();
      const index = productos.findIndex((p) => p.id == id);
      if (index === -1) return res.status(404).json({ error: "No encontrado" });

      productos[index] = { ...productos[index], ...req.body };
      guardarProductosFS(productos);

      return res.json(productos[index]);
    }

    if (modo === "mongo") {
      const actualizado = await productModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!actualizado) return res.status(404).json({ error: "No encontrado" });

      return res.json(actualizado);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
};

export const eliminarProducto = async (req, res) => {
  const modo = req.app.locals.modo;
  const { id } = req.params;

  try {
    if (modo === "fs") {
      const productos = leerProductosFS();
      const index = productos.findIndex((p) => p.id == id);
      if (index === -1) return res.status(404).json({ error: "No encontrado" });

      const [eliminado] = productos.splice(index, 1);
      guardarProductosFS(productos);

      return res.json({ eliminado });
    }

    if (modo === "mongo") {
      const eliminado = await productModel.findByIdAndDelete(id);
      if (!eliminado) return res.status(404).json({ error: "No encontrado" });

      return res.json({ eliminado });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};
