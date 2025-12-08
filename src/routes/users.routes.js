import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/users.controller.js";

import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.post("/", createUser);
router.post("/login", loginUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;

