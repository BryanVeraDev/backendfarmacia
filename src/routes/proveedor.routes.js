import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";
import {getProveedores, getProveedor, createProveedor, updateProveedorForTelefono,updateProveedorForIsActive} from "../controllers/proveedor.controller.js";


const router = Router()

router.get('/provider', getProveedores)
router.get('/provider/:nombre', getProveedor)
router.post('/provider', [verifyToken], createProveedor)
router.put('/provider/:id_proveedor', updateProveedorForTelefono)
router.put('/provider/isActive/:id_proveedor', updateProveedorForIsActive)


export default router