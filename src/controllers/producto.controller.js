import { pool } from "../db.js";

export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM producto p join categoria c on c.id_categoria = p.categoria");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductoId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM producto p join categoria c on c.id_categoria = p.categoria WHERE id_producto = ?", [
      id,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "producto not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductoName = async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.query("SELECT * FROM producto p join categoria c on c.id_categoria = p.categoria WHERE nombre = ?", [
      name,
    ]);

    if (rows.length <= 0) {
      return res.status(404).json({ message: "producto not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosCount = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT count(id_producto) as cantidad FROM producto p where isActive = 1");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosAsc = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM producto p JOIN categoria c on c.id_categoria = p.categoria WHERE p.isActive = 1 ORDER BY p.cantidad ASC");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosDesc = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM producto p JOIN categoria c on c.id_categoria = p.categoria WHERE p.isActive = 1 ORDER BY p.cantidad DESC");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosCategory = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT c.descripcion as name_categoria, count(p.id_producto) as cantidad FROM categoria c JOIN producto p on p.categoria = c.id_categoria GROUP BY 1");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createProducto = async (req, res) => {
  try {
    const { nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria, proveedor, isActive } = req.body;

    const [rows2] = await pool.query("SELECT * FROM producto p join categoria c on c.id_categoria = p.categoria WHERE nombre = ?", [
      nombre,
    ]);

    console.log(rows2.length)
    
    if (rows2.length <= 0) {
      const [rows] = await pool.query(
        "INSERT INTO producto (nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria, proveedor, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria, proveedor, isActive]
      );
      res.status(201).json({ id_producto: rows.insertId, nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria, proveedor, isActive });

    }
    else{
      
      await pool.query("UPDATE producto SET cantidad = ? WHERE nombre = ?", [
        new_value,
        nombre,
      ]);

      res.status(201).json({ id_producto: rows2.insertId, nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria, proveedor, isActive });
      
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProductoPrecio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria } = req.body;

    const [result] = await pool.query(
      "UPDATE producto SET precio_unitario = IFNULL(?, precio_unitario) WHERE id_producto = ?",
      [nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "producto not found" });

    const [rows] = await pool.query("SELECT * FROM producto WHERE id_producto = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProductoIsActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    console.log(id)
    console.log(isActive)

    const [result] = await pool.query(
      "UPDATE producto SET isActive = IFNULL(?, isActive) WHERE id_producto = ?",
      [isActive, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "producto not found" });

    const [rows] = await pool.query("SELECT * FROM producto WHERE id_producto = ?", [
      id,
    ]);

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

