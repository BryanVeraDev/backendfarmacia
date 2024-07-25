import { Router } from "express";
import { getCompras, getComprasFilter, getComprasCount, createCompra, deleteCompra} from '../controllers/compra.controller.js'


const router = Router()


router.get('/buys', getCompras)
router.get('/buys/date', getComprasFilter)
router.get('/buys/count', getComprasCount)
router.post('/buys', createCompra)
router.delete('/buys', deleteCompra)


export default router