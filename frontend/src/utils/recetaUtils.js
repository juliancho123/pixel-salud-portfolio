import axios from "axios";

export async function marcarRecetaUsada(idReceta, token) {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/recetas/usada/${idReceta}`,
      {},
      { headers: { Auth: `Bearer ${token}` } }
    );
    return true;
  } catch (err) {
    console.error("Error al marcar receta como usada", err);
    return false;
  }
}