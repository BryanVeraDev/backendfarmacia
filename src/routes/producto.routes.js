import { Router } from "express";

import {
    createProducto,
    getProductoId,
    getProductoName,
    getProductos,
    getProductosCount,
    getProductosAsc,
    getProductosDesc,
    getProductosCategory,
    updateProductoPrecio,
    updateProductoIsActive,
  } from "../controllers/producto.controller.js";

  import { verifyToken, isAdmin } from "../middlewares/authJwt.js";


const router = Router()


router.get('/products', getProductos)
router.get("/products/product/:id", getProductoId);
router.get("/products/count", getProductosCount);
router.get("/products/categories", getProductosCategory);
router.get("/products/asc", getProductosAsc);
router.get("/products/desc", getProductosDesc);
router.get("/products/search/:name", getProductoName);
router.post('/products', createProducto)
router.put('/products/price/:id', updateProductoPrecio)
router.put('/products/isactive/:id', updateProductoIsActive)



export default router