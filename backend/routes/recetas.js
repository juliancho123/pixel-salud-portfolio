const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")
const { verificarRol }= require("../middlewares/verificarPermisos")
const {getMisRecetas, crearReceta, darBajaReceta, getRecetasClienteActivas, marcarRecetaUsada} = require("../controllers/recetas")


router.put("/recetas/usada/:idReceta", auth, verificarRol(["cliente", "admin"]), marcarRecetaUsada);

router.get("/recetas/cliente/:dniCliente", auth, verificarRol(["cliente", "admin"]), getRecetasClienteActivas);

router.get("/recetas/medico/:idMedico", auth, verificarRol(["medico", "admin"]), getMisRecetas);
router.post("/recetas/crear", auth, verificarRol(["medico"]), crearReceta);
router.put("/recetas/baja/:id", auth, verificarRol(["medico", "admin"]), darBajaReceta);

module.exports = router