import { pool } from "../db.js";

export const getProveedores = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM proveedor");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProveedor = async (req, res) => {
  try {
    const { nombre } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM proveedor WHERE nombre = ?",
      [nombre]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ message: "proveedor not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createProveedor = async (req, res) => {
  try {
    const { nombre, telefono } = req.body;
    const [rows] = await pool.query(
      "INSERT INTO proveedor (nombre, telefono, isActive) VALUES (?, ?, 1)",
      [nombre, telefono]
    );
    res
      .status(201)
      .json({ id_proveedor: rows.insertId, nombre, telefono, isActive: 1 });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProveedorForIsActive = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const { isActive } = req.body;
    console.log(id_proveedor)

    const [result] = await pool.query(
      "UPDATE proveedor SET isActive = ? WHERE id_proveedor = ?",
      [isActive, id_proveedor]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "proveedor not found" });

    const [rows] = await pool.query(
      "SELECT * FROM proveedor WHERE id_proveedor = ?",
      [id_proveedor]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProveedorForTelefono = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const { telefono } = req.body;

    const [result] = await pool.query(
      "UPDATE proveedor SET telefono = ? WHERE id_proveedor = ?",
      [telefono, id_proveedor]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "proveedor not found" });

    const [rows] = await pool.query(
      "SELECT * FROM proveedor WHERE id_proveedor = ?",
      [id_proveedor]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
