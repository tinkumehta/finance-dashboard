import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


import authRoutes from "./routes/auth.routes.js";
import requestRoutes from "./routes/request.routes.js";

app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);

export default app;