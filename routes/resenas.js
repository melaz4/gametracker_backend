import express from "express";
import { crearResena, listarResenas, editarResena, eliminarResena } from "../controllers/resenas.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, crearResena);
router.get("/", auth, listarResenas); // opcional: ?juegoId=...
router.put("/:id", auth, editarResena);
router.delete("/:id", auth, eliminarResena);

export default router;
