import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "34.133.74.17";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || ";=W_9N+wbxm4K5(MFAo]";
export const DB_DATABASE = process.env.DB_DATABASE || "farmacia";
export const SECRET = process.env.SECRET ||"CONTROLAPI";