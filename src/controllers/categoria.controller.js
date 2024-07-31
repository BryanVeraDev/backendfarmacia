import { pool } from "../db.js";

export const getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categoria");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getCategoria = async (req, res) => {
  try {
    const { descripcion } = req.params;

    const [rows] = await pool.query("SELECT * FROM categoria WHERE descripcion = ?", [
      descripcion,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "categoria not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


export const createCategoria = async (req, res) => {
  try {
    const { descripcion } = req.body;
    const nombreEnMayusculas = descripcion.toUpperCase();
    const [rows] = await pool.query(
      "INSERT INTO categoria (descripcion, isActive) VALUES (?, 1)",
      [nombreEnMayusculas]
    );   
    res.status(201).json({ id_categoria: rows.insertId, descripcion: nombreEnMayusculas, isActive: 1});
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const [valida] = await pool.query("SELECT * FROM producto p JOIN categoria c on c.id_categoria = p.categoria WHERE p.categoria = ?", [
      id,
    ]);

    if (valida.length > 0) {
      return res.status(404).json({ message: "Category has products" });
    }

    const [result] = await pool.query(
      "UPDATE categoria SET isActive = ? WHERE id_categoria = ?",
      [isActive, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "categoria not found" });

    const [rows] = await pool.query("SELECT * FROM categoria WHERE id_categoria = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};


export const updateCategoriaDescripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;

    const [result] = await pool.query(
      "UPDATE categoria SET descripcion = ? WHERE id_categoria = ?",
      [descripcion, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "categoria not found" });

    const [rows] = await pool.query("SELECT * FROM categoria WHERE id_categoria = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};