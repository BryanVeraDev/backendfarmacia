import { Router } from "express";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";
import {
    createCategoria,
    getCategoria,
    getCategorias,
    updateCategoria,
  } from "../controllers/categoria.controller.js";


const router = Router()


router.get('/categories', getCategorias)
router.get("/categories/:descripcion", getCategoria);
router.post('/categories',verifyToken, createCategoria)
router.put('/categories/:id', updateCategoria)




export default router