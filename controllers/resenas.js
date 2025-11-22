import Resena from "../models/resena.js";
import Juego from "../models/juego.js";

// Crear reseña
export async function crearResena(req, res) {
  try {
    const { juegoId, titulo, contenido, puntuacion } = req.body;
    const usuarioId = req.userId;

    // comprobar que el juego pertenece al usuario (opcional: permitir reseñas públicas)
    const juego = await Juego.findOne({ _id: juegoId, usuarioId });
    if (!juego) return res.status(404).json({ error: "Juego no encontrado o no autorizado" });

    const resena = new Resena({ juegoId, usuarioId, titulo, contenido, puntuacion });
    await resena.save();

    // recalcular puntuacionPromedio del juego
    await recalcularPuntuacionPromedio(juegoId);

    res.status(201).json(resena);
  } catch (err) {
    res.status(500).json({ error: "Error creando reseña" });
  }
}

// Listar reseñas del usuario o de un juego
export async function listarResenas(req, res) {
  try {
    const { juegoId } = req.query;
    const usuarioId = req.userId;

    const filtro = juegoId ? { juegoId } : { usuarioId };
    const resenas = await Resena.find(filtro).sort({ fecha: -1 });
    res.json(resenas);
  } catch (err) {
    res.status(500).json({ error: "Error al listar reseñas" });
  }
}

// Editar reseña
export async function editarResena(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.userId;

    const resena = await Resena.findOneAndUpdate(
      { _id: id, usuarioId },
      req.body,
      { new: true }
    );

    if (!resena) return res.status(404).json({ error: "Reseña no encontrada o no autorizada" });

    await recalcularPuntuacionPromedio(resena.juegoId);

    res.json(resena);
  } catch (err) {
    res.status(500).json({ error: "Error al editar reseña" });
  }
}

// Eliminar reseña
export async function eliminarResena(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.userId;

    const resena = await Resena.findOneAndDelete({ _id: id, usuarioId });
    if (!resena) return res.status(404).json({ error: "Reseña no encontrada o no autorizada" });

    await recalcularPuntuacionPromedio(resena.juegoId);

    res.json({ mensaje: "Reseña eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar reseña" });
  }
}


// Helper: recalcular promedio de puntuacion
async function recalcularPuntuacionPromedio(juegoId) {
  const resenas = await Resena.find({ juegoId });
  if (resenas.length === 0) {
    await Juego.findByIdAndUpdate(juegoId, { puntuacionPromedio: 0 });
    return;
  }
  const suma = resenas.reduce((s, r) => s + r.puntuacion, 0);
  const promedio = parseFloat((suma / resenas.length).toFixed(2));
  await Juego.findByIdAndUpdate(juegoId, { puntuacionPromedio: promedio });
}
