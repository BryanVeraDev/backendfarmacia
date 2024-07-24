import { Router } from "express";
import { getCompras, createCompra, deleteCompra} from '../controllers/compra.controller.js'


const router = Router()


router.get('/buys', getCompras)

router.post('/buys', createCompra)

router.delete('/buys', deleteCompra)


export default router