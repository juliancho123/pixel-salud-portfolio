const express = require("express");
const {
  getUserOrders,
  mostrarTodasLasVentas,
  registrarVentaOnline,
  actualizarEstadoVenta,
  obtenerDetalleVentaOnline,
  actualizarVentaOnline
} = require("../controllers/ventasOnline"); // Asegúrate de importar getUserOrders si lo usas

const router = express.Router();
const auth = require("../middlewares/auth");
const { verificarRol, verificarPermisos } = require("../middlewares/verificarPermisos");


router.get("/mis-compras", auth, verificarRol(["cliente"]), getUserOrders);


router.get("/ventasOnline/todas", auth, verificarRol(["admin", "empleado"]), mostrarTodasLasVentas);


router.post("/ventaOnline/crear", auth, verificarRol(["admin", "empleado", "cliente"]), registrarVentaOnline);

router.put("/ventaOnline/estado", auth, verificarRol(["admin", "empleado"]), actualizarEstadoVenta);
router.get("/ventasOnline/detalle/:idVentaO", auth, verificarRol(["admin", "empleado"]), obtenerDetalleVentaOnline);
router.put("/ventaOnline/actualizar/:idVentaO", auth, verificarRol(["admin", "empleado"]), actualizarVentaOnline);

module.exports = router;