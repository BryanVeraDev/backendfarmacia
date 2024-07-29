import express from 'express'
import cors from 'cors'
import productosRoutes from './routes/producto.routes.js'
import categoriasRoutes from './routes/categoria.routes.js'
import authRoutes from './routes/auth.routes.js'
import indexRoutes from './routes/index.routes.js'
import compraRoutes from './routes/compra.routes.js'
import compra_productoRoutes from './routes/compra_producto.routes.js'
import proveedorRoutes from './routes/proveedor.routes.js'



const app = express()

// Middlewares
app.use(cors({
    origin: 'http://34.70.135.186:5173'
  }));
app.use(express.json())

// Routes
app.use("/",indexRoutes)
app.use("/api",productosRoutes)
app.use("/api",categoriasRoutes)
app.use("/api",authRoutes)
app.use("/api",compraRoutes)
app.use("/api",compra_productoRoutes)
app.use("/api",proveedorRoutes)


app.use((req, res, next) => {
    res.status(404).json({
        message: 'endpoint Not Found'
    })
})

export default app;