import Usuario from "../models/usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registrar(req, res) {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const existe = await Usuario.findOne({ email });
        if (existe) return res.status(400).json({ error: "El correo ya está registrado" });

        const hashed = await bcrypt.hash(password, 10);

        const usuario = new Usuario({
            nombre,
            email,
            password: hashed
        });

        await usuario.save();

        res.status(201).json({ mensaje: "Usuario registrado correctamente" });

    } catch (error) {
        res.status(500).json({ error: "Error interno en el servidor" });
    }
}



export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos" });
        }

        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(400).json({ error: "Correo o contraseña incorrectos" });
        }

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
        res.status(500).json({ error: "Error interno en el servidor" });
    }
}
