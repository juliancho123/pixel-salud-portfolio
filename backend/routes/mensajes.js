const express = require("express");
const router = express.Router();
const { crearMensaje, listarMensajes } = require("../controllers/mensajes");



router.post("/crear", crearMensaje);


router.get("/", listarMensajes);

module.exports = router;