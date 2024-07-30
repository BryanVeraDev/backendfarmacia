import { pool } from "../db.js";

export const transformarProductos = (rows) => {
  return rows.map((row) => ({
    id_producto: row.id_producto,
    nombre: row.producto_nombre,
    precio_unitario: row.precio_unitario,
    cantidad: row.cantidad,
    isActive: row.producto_activo,
    categoria: {
      id_categoria: row.id_categoria,
      descripcion: row.categoria_nombre,
      isActive: row.categoria_activo,
    },
    proveedor: {
      id_proveedor: row.id_proveedor,
      nombre: row.proveedor_nombre,
      telefono: row.proveedor_telefono,
      isActive: row.proveedor_activo,
    },
  }));
};

export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, c.id_categoria, c.descripcion AS categoria_nombre, c.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo FROM producto p JOIN categoria c ON c.id_categoria = p.categoria JOIN proveedor pr ON pr.id_proveedor = p.proveedor WHERE p.isActive = 1;"
    );
    const productos = transformarProductos(rows);
    res.json(productos);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductoId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, c.id_categoria, c.descripcion AS categoria_nombre, c.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo FROM producto p JOIN categoria c ON c.id_categoria = p.categoria JOIN proveedor pr ON pr.id_proveedor = p.proveedor WHERE p.id_producto = ? AND p.isActive = 1",
      [id]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ message: "producto not found" });
    }

    const productos = transformarProductos(rows);
    res.json(productos[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductoName = async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.query(
      "SELECT p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, c.id_categoria, c.descripcion AS categoria_nombre, c.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo FROM producto p JOIN categoria c ON c.id_categoria = p.categoria JOIN proveedor pr ON pr.id_proveedor = p.proveedor WHERE p.nombre = ? AND p.isActive = 1",
      [name]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ message: "producto not found" });
    }

    const productos = transformarProductos(rows);
    res.json(productos[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosCount = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT count(id_producto) as cantidad FROM producto p where isActive = 1"
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosAsc = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, c.id_categoria, c.descripcion AS categoria_nombre, c.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo FROM producto p JOIN categoria c ON c.id_categoria = p.categoria JOIN proveedor pr ON pr.id_proveedor = p.proveedor WHERE p.isActive = 1 ORDER BY p.cantidad ASC"
    );
    const productos = transformarProductos(rows);
    res.json(productos);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosDesc = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, c.id_categoria, c.descripcion AS categoria_nombre, c.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo FROM producto p JOIN categoria c ON c.id_categoria = p.categoria JOIN proveedor pr ON pr.id_proveedor = p.proveedor WHERE p.isActive = 1 ORDER BY p.cantidad DESC"
    );

    const productos = transformarProductos(rows);
    res.json(productos);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosAlarm = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, c.id_categoria, c.descripcion AS categoria_nombre, c.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo FROM producto p JOIN categoria c ON c.id_categoria = p.categoria JOIN proveedor pr ON pr.id_proveedor = p.proveedor WHERE p.isActive = 1 AND p.cantidad < 5 ORDER BY p.cantidad DESC"
    );
    const productos = transformarProductos(rows);
    res.json(productos);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductosCategory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT c.descripcion as name_categoria, count(p.id_producto) as cantidad FROM categoria c JOIN producto p on p.categoria = c.id_categoria GROUP BY 1"
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getProductSuggestions = async (req, res) => {
  try {
    const { word } = req.params;
    if (!word) {
      return res.status(400).json({ message: "Search parameter is missing" });
    }

    const searchPattern = `%${word}%`;

    const [rows] = await pool.query(
      "SELECT nombre, peso FROM producto WHERE (nombre LIKE ? OR id_producto LIKE ?) AND isActive = 1",
      [searchPattern, searchPattern]
    );

    if (rows.length <= 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createProducto = async (req, res) => {
  try {
    const {
      nombre,
      peso,
      precio_unitario,
      cantidad,
      fecha_vencimiento,
      categoria,
      proveedor,
      isActive,
    } = req.body;

    const [rows2] = await pool.query(
      "SELECT * FROM producto p join categoria c on c.id_categoria = p.categoria WHERE nombre = ? AND peso = ?",
      [nombre, peso]
    );

    if (rows2.length <= 0) {
      const [rows] = await pool.query(
        "INSERT INTO producto (nombre, peso, precio_unitario, cantidad, fecha_vencimiento, categoria, proveedor, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          nombre,
          peso,
          precio_unitario,
          cantidad,
          fecha_vencimiento,
          categoria,
          proveedor,
          isActive,
        ]
      );
      res
        .status(201)
        .json({
          id_producto: rows.insertId,
          nombre,
          peso,
          precio_unitario,
          cantidad,
          fecha_vencimiento,
          categoria,
          proveedor,
          isActive,
        });
    } else {
      const new_value = rows2[0].cantidad + cantidad;

      await pool.query("UPDATE producto SET cantidad = ? WHERE nombre = ?", [
        new_value,
        nombre,
      ]);

      res
        .status(201)
        .json({
          id_producto: rows2.insertId,
          nombre,
          peso,
          precio_unitario,
          cantidad: new_value,
          fecha_vencimiento,
          categoria,
          proveedor,
          isActive,
        });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProductoPrecio = async (req, res) => {
  try {
    const { id } = req.params;
    const { precio_unitario } = req.body;

    const [result] = await pool.query(
      "UPDATE producto SET precio_unitario = IFNULL(?, precio_unitario) WHERE id_producto = ?",
      [precio_unitario, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "producto not found" });

    const [rows] = await pool.query(
      "SELECT * FROM producto WHERE id_producto = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const updateProductoIsActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    console.log(id);
    console.log(isActive);

    const [result] = await pool.query(
      "UPDATE producto SET isActive = IFNULL(?, isActive) WHERE id_producto = ?",
      [isActive, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "producto not found" });

    const [rows] = await pool.query(
      "SELECT * FROM producto WHERE id_producto = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
