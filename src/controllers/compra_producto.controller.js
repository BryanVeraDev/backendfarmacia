import { pool } from "../db.js";

export const createCompra_productos = async (req, res) => {
  try {
    const { id_compra, id_producto, cantidad_producto } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO compra_producto (id_compra, id_producto, cantidad_producto) VALUES (?, ?, ?)",
      [id_compra, id_producto, cantidad_producto]
    );
    res.status(201).json({ id_compra_producto: rows.insertId, id_compra, id_producto, cantidad_producto });
  } catch (error) {
    console.error(error);  // Loguea el error en la consola
    return res.status(500).json({ message: "Something goes wrong", error: error.message });
  }
};







