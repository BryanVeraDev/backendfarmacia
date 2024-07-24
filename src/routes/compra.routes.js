import { Router } from "express";
import { getCompra, createCompra, deleteCompra} from '../controllers/compra.controller.js'


const router = Router()


router.get('/buys', getCompra)

router.post('/buys', createCompra)

router.delete('/buys', deleteCompra)


export default router