//lamamos la las dependencias express, mongoose, cors y dotenv
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Juego from './models/juego.js';
import dotenv from 'dotenv';
dotenv.config(); 

//aplicacion de express
const app = express();

// configurar y permitir cors
app.use(cors());
app.use(express.json());


//coneccion mongoose
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

  
//espacio de endpoints

//endpoint para agregar un nuevo juego
app.post('/api/juegos', async (req,res) => {
    try {
    const nuevoJuego = new Juego(req.body);
    const juegoGuardado = await nuevoJuego.save();
    res.status(201).json(juegoGuardado);
    }
    catch (error) {
      res.status(400).json({ error: 'Error al guardar el juego' });
    }
});

//endpoint para obtener todos los juegos
app.get('/api/juegos', async (req, res) => {
    try {
        const juegos = await Juego.find();
        res.json(juegos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los juegos' });
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


const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


