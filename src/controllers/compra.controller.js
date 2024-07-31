import { pool } from "../db.js";

export const transformarCompra = (compra, allProducts) => {
  const productos = allProducts
    .filter(product => product.id_compra === compra.id_compra)
    .map(product => ({
      id_producto: product.id_producto,
      nombre: product.producto_nombre,
      precio: product.precio_unitario,
      cantidad: product.cantidad_producto, 
      isActive: product.producto_activo,
      categoria: {
        id_categoria: product.id_categoria,
        descripcion: product.categoria_nombre,
        isActive: product.categoria_activo,
      },
      proveedor: {
        id_proveedor: product.id_proveedor,
        nombre: product.proveedor_nombre,
        telefono: product.proveedor_telefono,
        isActive: product.proveedor_activo,
      },
    }));

  // Construir el objeto de compra transformado
  return {
    id_compra: compra.id_compra,
    fecha: compra.fecha,
    nombre_cliente: compra.nombre_cliente,
    total: compra.total, 
    productos: productos,
  };
};

export const getCompras = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM compra c");

    const comprasTransformadas = [];

    for (const compra of rows) {
      const { id_compra } = compra;
      const [products] = await pool.query(
        "SELECT cp.id_compra_producto , cp.cantidad_producto, p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, cat.id_categoria, cat.descripcion AS categoria_nombre, cat.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo, c.id_compra, c.nombre_cliente, c.fecha as compra_fecha, c.total as compra_total from compra_producto cp JOIN producto p on p.id_producto = cp.id_producto JOIN compra c on c.id_compra = cp.id_compra JOIN categoria cat on cat.id_categoria = p.categoria JOIN proveedor pr on pr.id_proveedor = p.proveedor WHERE c.id_compra = ? ORDER BY 1 ASC;",
        [id_compra]
      );

      const compraTransformada = transformarCompra(compra, products);

      comprasTransformadas.push(compraTransformada);

    }

    res.json(comprasTransformadas);

  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const createCompra = async (req, res) => {
  try {
    const { nombre_cliente, fecha, total, productos } = req.body;
    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: "empty product list" });
    }

    for (const producto of productos) {
      const { id_producto, cantidad_producto } = producto;

      const [productRows] = await pool.query(
        "SELECT cantidad, nombre FROM producto WHERE id_producto = ? AND isActive = 1",
        [id_producto]
      );

      const cantidadDisponible = productRows[0].cantidad;
      const nombreProducto = productRows[0].nombre;

      console.log(cantidad_producto)
      console.log(cantidadDisponible)
      console.log(nombreProducto

      )
      if (cantidad_producto > cantidadDisponible) {
        return res
          .status(400)
          .json({
            message: `the product ${nombreProducto} exceeds the quantity in stock`,
          });
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

      await pool.query(
        "UPDATE producto SET cantidad = cantidad - ? WHERE id_producto = ?",
        [cantidad_producto, id_producto]
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

export const getComprasFilter = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.body;
    
    const [rows] = await pool.query(
      "SELECT * FROM compra WHERE fecha BETWEEN ? AND ?",
      [fecha_inicio, fecha_fin]
    );

    const comprasTransformadas = [];

    for (const compra of rows) {
      const { id_compra } = compra;
      const [products] = await pool.query(
        "SELECT cp.id_compra_producto , cp.cantidad_producto, p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, cat.id_categoria, cat.descripcion AS categoria_nombre, cat.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo, c.id_compra, c.nombre_cliente, c.fecha as compra_fecha, c.total as compra_total from compra_producto cp JOIN producto p on p.id_producto = cp.id_producto JOIN compra c on c.id_compra = cp.id_compra JOIN categoria cat on cat.id_categoria = p.categoria JOIN proveedor pr on pr.id_proveedor = p.proveedor WHERE c.id_compra = ? ORDER BY 1 ASC;",
        [id_compra]
      );

      const compraTransformada = transformarCompra(compra, products);

      comprasTransformadas.push(compraTransformada);

    }

    res.json(comprasTransformadas);

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const getComprasFilterAesthetic = async (req, res) => {
  try {
    const { inicio, fin } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM compra WHERE fecha BETWEEN ? AND ?",
      [inicio, fin]
    );

    const comprasTransformadas = [];

    for (const compra of rows) {
      const { id_compra } = compra;
      const [products] = await pool.query(
        "SELECT cp.id_compra_producto , cp.cantidad_producto, p.id_producto, p.nombre AS producto_nombre, p.precio_unitario, p.cantidad, p.isActive as producto_activo, cat.id_categoria, cat.descripcion AS categoria_nombre, cat.isActive as categoria_activo, pr.id_proveedor, pr.nombre AS proveedor_nombre, pr.telefono as proveedor_telefono, pr.isActive as proveedor_activo, c.id_compra, c.nombre_cliente, c.fecha as compra_fecha, c.total as compra_total from compra_producto cp JOIN producto p on p.id_producto = cp.id_producto JOIN compra c on c.id_compra = cp.id_compra JOIN categoria cat on cat.id_categoria = p.categoria JOIN proveedor pr on pr.id_proveedor = p.proveedor WHERE c.id_compra = ? ORDER BY 1 ASC;",
        [id_compra]
      );

      const compraTransformada = transformarCompra(compra, products);

      comprasTransformadas.push(compraTransformada);
    }

    res.json(comprasTransformadas);

  } catch (error) {
    console.log(error)
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

export const getComprasCount = async (req, res) => {
  try {
    const { fecha } = req.body;
    const [rows] = await pool.query(
      "SELECT count(*) as cantidad FROM compra WHERE fecha = ?",
      [fecha]
    );

    res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};
