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


const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


