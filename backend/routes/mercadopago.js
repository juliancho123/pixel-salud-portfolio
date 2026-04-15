const express = require("express");
const router = express.Router();
const mercadoPagoController = require("../controllers/mercadopago");
const auth = require("../middlewares/auth")
const {verificarRol} = require("../middlewares/verificarPermisos")


router.post("/create-order",auth,verificarRol(["cliente"]), mercadoPagoController.createOrder);


router.post("/notifications", mercadoPagoController.receiveWebhook);


router.delete("/clearUserCart",auth, verificarRol(["cliente"]), mercadoPagoController.clearUserCart);


router.get("/orders", auth, verificarRol(["cliente"]), mercadoPagoController.getUserOrders);

module.exports = router;
