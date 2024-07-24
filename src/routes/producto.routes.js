import { Router } from "express";

import {
    createProducto,
    deleteProducto,
    getProducto,
    getProductos,
    updateProducto,
  } from "../controllers/producto.controller.js";

  import { verifyToken, isAdmin } from "../middlewares/authJwt.js";


const router = Router()

router.get('/products', [ verifyToken, isAdmin ], getProductos)
router.get("/products/:id", verifyToken , getProducto);
router.post('/products', createProducto)
router.put('/products', updateProducto)
router.delete('/products', deleteProducto)



export default router