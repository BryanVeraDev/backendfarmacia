import { Router } from "express";
import { createCompra_productos, getCompra_productos } from '../controllers/compra_producto.controller.js'

const router = Router()

router.post('/buy_products', createCompra_productos)
router.get('/buy_products/:id', getCompra_productos)

export default router