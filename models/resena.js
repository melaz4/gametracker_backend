import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  juegoId: { type: mongoose.Schema.Types.ObjectId, ref: "Juego", required: true },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  titulo: { type: String },
  contenido: { type: String },
  puntuacion: { type: Number, required: true, min: 0, max: 5 },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Resena", resenaSchema);
