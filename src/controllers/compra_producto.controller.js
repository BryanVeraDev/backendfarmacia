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

export const getCompra_productos = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT cp.id_compra_producto , p.id_producto, p.nombre, cp.cantidad_producto, p.precio_unitario from compra_producto cp JOIN producto p on p.id_producto = cp.id_producto JOIN compra c on c.id_compra = cp.id_compra WHERE c.id_compra = ? ORDER BY 1 ASC",
      [id]
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};







