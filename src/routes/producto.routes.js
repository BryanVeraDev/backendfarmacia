import { Router } from "express";

import {
    createProducto,
    getProductoId,
    getProductoName,
    getProductos,
    getProductosCount,
    getProductosAsc,
    getProductosDesc,
    getProductosAlarm,
    getProductosCategory,
    updateProducto,
    updateProductoIsActive,
    getProductSuggestions,
    getProductosTodos
  } from "../controllers/producto.controller.js";

  import { verifyToken, isAdmin } from "../middlewares/authJwt.js";


const router = Router()

router.get('/productsall', getProductosTodos)
router.get('/products', getProductos)
router.get("/products/product/:id", getProductoId);
router.get("/products/count", getProductosCount);
router.get("/products/categories", getProductosCategory);
router.get("/products/asc", getProductosAsc);
router.get("/products/desc", getProductosDesc);
router.get("/products/alarm", getProductosAlarm);
router.get("/products/search/:name", getProductoName);
router.get("/products/suggest/:word", getProductSuggestions);
router.post('/products', createProducto)
router.put('/products/price/:id', updateProducto)
router.put('/products/isactive/:id', updateProductoIsActive)



export default router