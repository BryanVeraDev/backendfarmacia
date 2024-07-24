import { Router } from "express";

import {
    createProducto,
    getProductoId,
    getProductoName,
    getProductos,
    updateProductoPrecio,
    updateProductoIsActive,
  } from "../controllers/producto.controller.js";

  import { verifyToken, isAdmin } from "../middlewares/authJwt.js";


const router = Router()

router.get('/products', [ verifyToken, isAdmin ], getProductos)
router.get("/products/:id", verifyToken , getProductoId);
router.get("/products/search/:name", getProductoName);
router.post('/products', createProducto)
router.put('/products/price/:id', updateProductoPrecio)
router.put('/products/isactive/:id', updateProductoIsActive)



export default router