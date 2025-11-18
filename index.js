//pedir las dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Conexión a MongoDB
const MONGODB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/game-tracker';

mongoose.connect(MONGODB_URL)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Esquema de Juego
const juegoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },

  desarrollador: {
    type: String,
    default: 'Desconocido'
  },
  
  genero: {
    type: String,
    default: ''
  },

  descripcion: {
    type: String,
    default: ''
  },

  imagen: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Game Tracker funcionando');
});

// Obtener todos los juegos
app.get('/juegos', async (req, res) => {
  try {
    const juegos = await Juego.find();
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});

// Agregar un nuevo juego
app.post('/juegos', async (req, res) => {
  try {
    const { nombre, descripcion, desarrollador, imagen } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    const nuevoJuego = new Juego({ 
      nombre, 
      descripcion: descripcion || '', 
      desarrollador: desarrollador || 'Desconocido', 
      imagen: imagen || '' 
    });
    await nuevoJuego.save();
    res.status(201).json(nuevoJuego);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar juego' });
  }
});

// Eliminar un juego por id
app.delete('/juegos/:id', async (req, res) => {
  try {
    const juego = await Juego.findByIdAndDelete(req.params.id);
    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar juego' });
  }
});

