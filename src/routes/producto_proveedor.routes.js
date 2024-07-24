import { Router } from "express";

import {createProducto_proveedor} from "../controllers/producto_proveedor.controller.js";


const router = Router()

router.post('/products_provider', createProducto_proveedor)


export default router