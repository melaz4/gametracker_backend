import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.js";

const router = express.Router();

// 🔵 Registro
router.post("/register", async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(400).json({ error: "El email ya está registrado" });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordHash
        });

        await nuevoUsuario.save();

        res.json({ mensaje: "Usuario registrado con éxito" });

    } catch (err) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
});

// 🟩 Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(400).json({ error: "Credenciales incorrectas" });

        const coincide = await bcrypt.compare(password, usuario.password);
        if (!coincide) return res.status(400).json({ error: "Credenciales incorrectas" });

        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            mensaje: "Login exitoso",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

export default router;