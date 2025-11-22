//lamamos la las dependencias express, mongoose, cors y dotenv
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

//reseñas
import resenaRoutes from "./routes/resenas.js";

//modelos
import Juego from './models/juego.js';

//usuarios
import auth from "./middleware/auth.js";
import usuarioRoutes from "./routes/usuarios.js";

//variables de entorno
dotenv.config(); 


//aplicacion de express
const app = express();

// configurar y permitir cors
app.use(cors());
app.use(express.json());

//ruta de reseñas
app.use("/api/resenas", resenaRoutes);

//ruta de usuarios
app.use("/api/usuarios", usuarioRoutes);

//coneccion mongoose
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));


//espacio de endpoints

//endpoint para agregar un nuevo juego
app.post('/api/juegos', auth, async (req,res) => {
    try {
        const nuevoJuego = new Juego({
            ...req.body,
            usuarioId: req.userId
        });

        const juegoGuardado = await nuevoJuego.save();
        res.status(201).json(juegoGuardado);

    }
    
    catch (error) {
        res.status(400).json({ error: 'Error al guardar el juego' });
    }
});


//endpoint para obtener todos los juegos
app.get('/api/juegos', auth, async (req, res) => {
  try {
    const { genero, plataforma, completado } = req.query;
    const filtro = { usuarioId: req.userId };

    if (genero) filtro.genero = genero;
    if (plataforma) filtro.plataformas = plataforma; // mongoose busca en array
    if (completado !== undefined) filtro.completado = completado === "true";

    const juegos = await Juego.find(filtro);
    res.json(juegos);
  } 
  
  catch (error) {
    res.status(500).json({ error: 'Error al obtener los juegos' });
  }
});

//endpiont para estadisticas
app.get("/api/estadisticas", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const total = await Juego.countDocuments({ usuarioId: userId });
    const completados = await Juego.countDocuments({ usuarioId: userId, completado: true });
    const horasAgg = await Juego.aggregate([
      { $match: { usuarioId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalHoras: { $sum: "$horasJugadas" } } }
    ]);
    const totalHoras = horasAgg[0] ? horasAgg[0].totalHoras : 0;

    const avgScoreAgg = await Juego.aggregate([
      { $match: { usuarioId: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, avgScore: { $avg: "$puntuacionPromedio" } } }
    ]);
    const promedioPuntuacion = avgScoreAgg[0] ? parseFloat(avgScoreAgg[0].avgScore.toFixed(2)) : 0;

    res.json({
      total,
      completados,
      totalHoras,
      promedioPuntuacion
    });

  } 
  
  catch (err) {
    res.status(500).json({ error: "Error al calcular estadísticas" });
  }
});

//endpoint para obtener un juego por id
app.get('/api/juegos/:id', async (req, res) => {
    try {
        const juego = await Juego.findById(req.params.id);
        if (!juego) return res.status(404).json({ error: 'Juego no encontrado' });
        res.json(juego);
    } catch (error) {
        res.status(400).json({ error: 'ID inválida' });
    }
});

//endpiont para editar un juego
app.put("/api/juegos/:id", auth, async (req, res) => {
    try {
        const juego = await Juego.findOneAndUpdate(
            { _id: req.params.id, usuarioId: req.userId },
            req.body,
            { new: true }
        );

        if (!juego)
            return res.status(404).json({ error: "Juego no encontrado o no autorizado" });

        res.json(juego);

    } catch (err) {
        res.status(500).json({ error: "Error al actualizar" });
    }
});


//endpoint para elimina un juego
app.delete("/api/juegos/:id", auth, async (req, res) => {
    try {
        const juego = await Juego.findOneAndDelete({
            _id: req.params.id,
            usuarioId: req.userId
        });

        if (!juego)
            return res.status(404).json({ error: "Juego no encontrado o no autorizado" });

        res.json({ mensaje: "Juego eliminado correctamente" });

    } catch (err) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});




const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


