import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { SECRET } from "../config.js";

export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "No user found" });

    req.user = rows[0];

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    console.log(req.userId)
    const [rows] = await pool.query(
      "SELECT * FROM usuario WHERE id_usuario = ?",
      [req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "No user found" });

    req.user = rows[0];
    const allowedUsernames = "admin"; // Define qué nombres de usuario tienen permiso

    if (allowedUsernames == req.user.nombre) {
    next()
    return
    }
    return res.status(403).json({ message: "Require Admin Role!" });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};
