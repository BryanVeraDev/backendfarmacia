import { pool } from "../db.js";

export const transformarCompraProductos = (rows) => {
  return rows.map(row => ({
    id_compra_producto: row.id_compra_producto,
    cantidad_producto: row.cantidad_producto,
    producto: {
      id_producto: row.id_producto,
      nombre: row.producto_nombre,
      precio: row.precio_unitario,
      cantidad: row.cantidad,
      isActive: row.producto_activo,
      categoria: {
        id_categoria: row.id_categoria,
        descripcion: row.categoria_nombre,
        isActive: row.categoria_activo
      },
      proveedor: {
        id_proveedor: row.id_proveedor,
        nombre: row.proveedor_nombre,
        telefono: row.proveedor_telefono,
        isActive: row.proveedor_activo
      }
    },
    compra: {
      id_compra: row.id_compra,
      nombre_cliente: row.nombre_cliente,
      fecha: row.compra_fecha,
      total: row.compra_total
    }
  }));
};

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
    const [rows] = await pool.query("SELECT cp.id_compra_producto , cp.cantidad_producto, p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, cat.id_categoria, cat.descripcion AS categoria_nombre, cat.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo, c.id_compra, c.nombre_cliente, c.fecha as compra_fecha, c.total as compra_total from compra_producto cp JOIN producto p on p.id_producto = cp.id_producto JOIN compra c on c.id_compra = cp.id_compra JOIN categoria cat on cat.id_categoria = p.categoria JOIN proveedor pr on pr.id_proveedor = p.proveedor WHERE c.id_compra = ? ORDER BY 1 ASC;",
      [id]
    );
    const compraProductos = transformarCompraProductos(rows)
    res.json(compraProductos)
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};







