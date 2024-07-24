import { Router } from "express";
import { createCompra_productos } from '../controllers/compra_producto.controller.js'

const router = Router()

router.post('/buy_products', createCompra_productos)

export default router