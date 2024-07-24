import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import jwt from 'jsonwebtoken';
import { SECRET }  from '../config.js'

export const signUp = async (req, res) => {
  try {
    const { nombre, clave } = req.body;
    const hashedPassword = await encryptPassword(clave);

    // Insertar el nuevo usuario en la base de datos
    const [result] = await pool.query(
      "INSERT INTO usuario (nombre, clave) VALUES (?, ?)",
      [nombre, hashedPassword]
    );
    res.status(201).json({ id_usuario: result.insertId, nombre, hashedPassword });
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { nombre, clave } = req.body;
    // Buscar el usuario por email
    const [rows] = await pool.query("SELECT * FROM usuario WHERE nombre = ?", [
      nombre
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "User Not Found" });

    const user = rows[0];

    const matchPassword = await comparePassword(clave, user.clave);

    if (!matchPassword) {
      return res.status(401).json({
        token: null,
        message: 'Invalid Password',
      });
    }

    const token = jwt.sign({ id: user.id_usuario }, SECRET, {
        expiresIn: 86400, // 24 hours
      });
  
      res.json({ token });
    
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};
