import { pool } from '../db.js'

export const createProducto_proveedor = async (req, res) => {
    try {
      const { id_producto, id_proveedor, cantidad_producto, fecha } = req.body;
      const [rows] = await pool.query(
        "INSERT INTO producto_proveedor (id_producto, id_proveedor, cantidad_producto, fecha) VALUES (?, ?, ?, ?)",
        [id_producto, id_proveedor, cantidad_producto, fecha]
      );
      res.status(201).json({ id_producto_proveedor: rows.insertId, id_producto, id_proveedor, cantidad_producto, fecha });
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };
  