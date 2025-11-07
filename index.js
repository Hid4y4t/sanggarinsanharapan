import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./config/Koneksi.js";
import dotenv from "dotenv";
dotenv.config();


// databses
import './models/Admin.js';
import './models/Agenda.js';
import './models/Lukisan.js';
import './models/ProfilPerusahaan.js';
import './models/Artikel.js';


// route
import AdminRoute from './routes/Admin.js';
import AgendaRoute from './routes/Agenda.js';
import LukisanRoute from './routes/Lukisan.js';
import PerusahaanRoute from './routes/ProfilePerusahaan.js';
import ArtikelRoute from "./routes/Artikel.js";

const app = express();
app.use(cors({
    origin: 'https://sanggarinsanharapan.rumahsehatkita.online',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/upload', express.static('upload'));


app.use(AdminRoute);
app.use(AgendaRoute);
app.use(LukisanRoute);
app.use(PerusahaanRoute);
app.use(ArtikelRoute);

try {
  await db.authenticate();
  console.log("Database connected successfully");
} catch (error) {
  console.error("Database connection failed:", error);
}




app.listen(5000, () => console.log("Server is running on port 5000"));

