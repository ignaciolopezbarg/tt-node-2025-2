// src/controllers/users.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/users.model.js";

// --------------------
// GET ALL USERS
// --------------------
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password"); // no devolver passwords
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// --------------------
// GET USER BY ID
// --------------------
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

// CREATE USER

export const createUser = async (req, res) => {
  const { nombre, apellido, email, edad, password, rol } = req.body;

  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    // Verificar si el email ya existe
    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ error: "Email ya registrado" });

    // Hashear password (usar BCRYPT_ROUNDS de .env si existe)
    const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, rounds);

    const newUser = await UserModel.create({
      nombre,
      apellido,
      email,
      edad,
      password: hashedPassword,
      rol,
    });

    // Crear JWT y devolverlo junto con la respuesta o crear JWT con la ruta de login
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, rol: newUser.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuario creado",
      token,
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        apellido: newUser.apellido,
        email: newUser.email,
        edad: newUser.edad,
        rol: newUser.rol,
      },
    });
  } catch (err) {
    console.error("ERROR en createUser:", err);
    res.status(500).json({ error: err.message || "Error al crear usuario" });
  }
};

// UPDATE USER

export const updateUser = async (req, res) => {
  const { nombre, apellido, email, edad, password, rol } = req.body;

  try {
    const updateData = { nombre, apellido, email, edad, rol };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// DELETE USER

export const deleteUser = async (req, res) => {
  try {
    const deleted = await UserModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

// LOGIN USER

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email y password requeridos" });

  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Email o password incorrectos" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ error: "Email o password incorrectos" });

    // Crear JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al hacer login" });
  }
};
