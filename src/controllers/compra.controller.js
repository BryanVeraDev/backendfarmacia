import { pool } from "../db.js";

export const getCompra = async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM compra c");
      res.json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

export const createCompra = async (req, res) => {
    try {
      const { nombre_cliente, fecha } = req.body;
      const [rows] = await pool.query(
        "INSERT INTO compra (nombre_cliente, fecha) VALUES (?, ?)",
        [nombre_cliente, fecha]
      );
      res.status(201).json({ id_compra: rows.insertId, nombre_cliente, fecha});
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
  };

export const deleteCompra = async (req, res) => {
    try {
      const { id_compra } = req.params;
      const [rows] = await pool.query("DELETE FROM compra WHERE id_compra = ? ", [id_compra]);
  
      if (rows.affectedRows <= 0) {
        return res.status(404).json({ message: "Compra not found" });
      }
  
      res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: "Something goes wrong" });
    }
};

