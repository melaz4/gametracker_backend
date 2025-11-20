import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    desarrollador: { type: String },
    genero: { type: String},
    descripcion: { type: String },
    imagen: { type: String },
    fechaCreacion:{ type: Date, default: Date.now }
})

export default mongoose.model('Juego', juegoSchema);