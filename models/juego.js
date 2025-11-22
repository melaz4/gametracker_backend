import mongoose from "mongoose";

const juegoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  desarrollador: { type: String },
  genero: { type: String },
  plataformas: [{ type: String }], // ej: ['PC', 'PS5']
  descripcion: { type: String },
  imagen: { type: String },
  completado: { type: Boolean, default: false },
  horasJugadas: { type: Number, default: 0 },
  puntuacionPromedio: { type: Number, default: 0 }, // calculada a partir de reseñas
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  fechaCreacion: { type: Date, default: Date.now }
});

export default mongoose.model('Juego', juegoSchema);
