import { pool } from "../db.js";

export const getCompras = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM compra c");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createCompra = async (req, res) => {
  try {
    const { nombre_cliente, fecha, total, productos } = req.body
    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: "empty product list" })
    }

    for (const producto of productos) {
      const { id_producto, cantidad_producto } = producto

      const [productRows] = await pool.query(
        "SELECT cantidad, nombre FROM producto WHERE id_producto = ?",
        [id_producto]
      );

      const cantidadDisponible = productRows[0].cantidad
      const nombreProducto = productRows[0].nombre

      if (cantidad_producto > cantidadDisponible) {
        return res.status(400).json({ message: `the product ${nombreProducto} exceeds the quantity in stock` })
      }
    }

    const [rows] = await pool.query(
      "INSERT INTO compra (nombre_cliente, fecha, total) VALUES (?, ?, 0)",
      [nombre_cliente, fecha, total]
    );

    const id_compra = rows.insertId;

    for (const producto of productos) {
      const { id_producto, cantidad_producto } = producto;
      await pool.query(
        "INSERT INTO compra_producto (id_compra, id_producto, cantidad_producto) VALUES (?, ?, ?)",
        [id_compra, id_producto, cantidad_producto]
      );
    }

    const [totalRows] = await pool.query(
      `SELECT SUM(cp.cantidad_producto * p.precio_unitario) as total
       FROM compra_producto cp
       JOIN producto p ON cp.id_producto = p.id_producto
       WHERE cp.id_compra = ?`,
      [id_compra]
    );

    const newTotal = totalRows[0].total;

    await pool.query("UPDATE compra SET total = ? WHERE id_compra = ?", [
      newTotal,
      id_compra,
    ]);

    res.status(201).json({ id_compra, nombre_cliente, fecha, total: newTotal });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const deleteCompra = async (req, res) => {
  try {
    const { id_compra } = req.params;
    const [rows] = await pool.query("DELETE FROM compra WHERE id_compra = ? ", [
      id_compra,
    ]);

    if (rows.affectedRows <= 0) {
      return res.status(404).json({ message: "Compra not found" });
    }

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
